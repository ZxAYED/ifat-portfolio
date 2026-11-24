import { createHash } from 'node:crypto';
import { CONTACT_LIMITS, isEmail, validateContact } from './contact-rules.mjs';

// This is the recipient supplied by the portfolio owner. A visitor cannot override it.
export const CONTACT_RECIPIENT = 'ifatibrahim20@gmail.com';

/** @param {Record<string, string | undefined>} env */
export function readSmtpConfiguration(env) {
  const host = (env.SMTP_HOST || 'smtp.gmail.com').trim();
  const port = Number(env.SMTP_PORT || '465');
  const user = (env.SMTP_USER || '').trim();
  const rawPassword = env.SMTP_PASS || '';
  const pass = host === 'smtp.gmail.com' ? rawPassword.replace(/\s/g, '') : rawPassword;
  if (!host || /[\s/\u0000]/.test(host) || ![465, 587].includes(port) || !isEmail(user) || !pass) return null;
  return {
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
    dnsTimeout: 10_000,
    disableFileAccess: true,
    disableUrlAccess: true,
    logger: false,
    debug: false,
  };
}

/** @param {{name: string, email: string, message: string}} contact @param {string} sender */
export function createMailIntent(contact, sender) {
  return {
    from: { name: 'Ifat portfolio', address: sender },
    to: CONTACT_RECIPIENT,
    replyTo: { name: contact.name, address: contact.email },
    envelope: { from: sender, to: [CONTACT_RECIPIENT] },
    subject: `Portfolio inquiry — ${contact.name}`,
    text: `A new inquiry from Ifat’s portfolio\n\nName: ${contact.name}\nEmail: ${contact.email}\n\n${contact.message}\n`,
    disableFileAccess: true,
    disableUrlAccess: true,
  };
}

/** Only a positive SMTP acceptance for the actual destination counts as success. */
export function recipientAccepted(info) {
  const address = (value) => typeof value === 'string' ? value.toLowerCase() : String(value?.address || '').toLowerCase();
  return Array.isArray(info?.accepted) && info.accepted.some((value) => address(value) === CONTACT_RECIPIENT)
    && !(Array.isArray(info?.rejected) && info.rejected.some((value) => address(value) === CONTACT_RECIPIENT));
}

/**
 * Best-effort, bounded per-process protection. No persistent personal data or timers.
 * A shared rate-limit store / host protection is needed across multiple instances.
 */
export function createContactRateLimiter({ limit = 5, windowMs = 15 * 60_000, maxKeys = 1000, now = Date.now } = {}) {
  const entries = new Map();
  return (key) => {
    const time = now();
    for (const [entryKey, entry] of entries) if (entry.until <= time) entries.delete(entryKey);
    let entry = entries.get(key);
    if (!entry) {
      if (entries.size >= maxKeys) return { allowed: false, retryAfter: Math.ceil(windowMs / 1000) };
      entry = { count: 0, until: time + windowMs };
      entries.set(key, entry);
    }
    if (entry.count >= limit) return { allowed: false, retryAfter: Math.max(1, Math.ceil((entry.until - time) / 1000)) };
    entry.count++;
    return { allowed: true, retryAfter: 0 };
  };
}

const contactRateLimit = createContactRateLimiter();

/** @param {Request} request @param {Record<string, string | undefined>} env */
export function isAllowedOrigin(request, env) {
  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite === 'cross-site') return false;
  const origin = request.headers.get('origin');
  // Non-browser clients may omit Origin; authentication is not cookie-based.
  if (!origin) return true;
  const allowed = new Set([new URL(request.url).origin]);
  for (const candidate of [env.SITE_URL, env.NEXT_PUBLIC_SITE_URL, ...(env.CONTACT_ALLOWED_ORIGINS || '').split(',')]) {
    if (!candidate) continue;
    try { allowed.add(new URL(candidate.trim()).origin); } catch { /* Ignore invalid configuration. */ }
  }
  // The browser's Host header is not script-controlled. This supports ordinary
  // reverse-proxy previews without accepting arbitrary forwarded host values.
  const host = request.headers.get('host');
  if (host && !/[\s,/]/.test(host)) {
    try {
      const parsed = new URL(origin);
      if (parsed.host === host && ['http:', 'https:'].includes(parsed.protocol)) return true;
    } catch { return false; }
  }
  return allowed.has(origin);
}

async function readBoundedJson(request) {
  const announced = Number(request.headers.get('content-length'));
  if (Number.isFinite(announced) && announced > CONTACT_LIMITS.bodyBytes) throw new Error('BODY_TOO_LARGE');
  if (!request.body) throw new Error('INVALID_JSON');
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > CONTACT_LIMITS.bodyBytes) {
        await reader.cancel();
        throw new Error('BODY_TOO_LARGE');
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}

const json = (body, status, headers = {}) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

/**
 * Testable boundary for the Next Node route. The mail transport is injected;
 * unit tests can verify success and failure without contacting an email server.
 */
export async function handleContactRequest(request, { createTransport, env = process.env, rateLimit = contactRateLimit, onError = () => {} }) {
  if (!isAllowedOrigin(request, env)) return json({ ok: false, message: 'Please send your inquiry from this website, or email Ifat directly.' }, 403);
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return json({ ok: false, message: 'Please use the contact form to send your inquiry.' }, 415);
  }
  let input;
  try { input = await readBoundedJson(request); }
  catch (error) {
    return json({ ok: false, message: error.message === 'BODY_TOO_LARGE' ? 'Your message is too long. Please shorten it and try again.' : 'The message could not be read. Please try again.' }, error.message === 'BODY_TOO_LARGE' ? 413 : 400);
  }
  const checked = validateContact(input);
  if (!checked.ok) return json({ ok: false, message: checked.errors.website || 'Please check the highlighted fields.', errors: checked.errors }, 400);
  const configuration = readSmtpConfiguration(env);
  if (!configuration) return json({ ok: false, message: 'The contact form is temporarily unavailable. Your message has not been sent. Please email ifatibrahim20@gmail.com directly.' }, 503);
  // Trust only the address supplied by your configured reverse proxy in production.
  // It is a best-effort abuse guard, never authentication or authorization.
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim().slice(0, 128);
  const rateKey = createHash('sha256').update(ip || checked.data.email.toLowerCase()).digest('hex');
  const rate = rateLimit(rateKey);
  if (!rate.allowed) return json({ ok: false, message: 'You’ve sent several messages recently. Please wait a little, or email Ifat directly.' }, 429, { 'Retry-After': String(rate.retryAfter) });
  let transport;
  try {
    transport = createTransport(configuration);
    const info = await transport.sendMail(createMailIntent(checked.data, configuration.auth.user));
    if (!recipientAccepted(info)) throw Object.assign(new Error('Recipient not accepted'), { code: 'RECIPIENT_NOT_ACCEPTED' });
    return json({ ok: true, message: 'Your message is on its way. Thank you for getting in touch.' }, 200);
  } catch (error) {
    // Log a safe code only: never credentials, message text, or SMTP transcript.
    onError(typeof error?.code === 'string' && /^[A-Z_]+$/.test(error.code) ? error.code : 'SMTP_FAILURE');
    return json({ ok: false, message: 'We couldn’t confirm that your message was sent. Your draft is still here. Please try again later, or email ifatibrahim20@gmail.com directly.' }, 502);
  } finally { transport?.close?.(); }
}
