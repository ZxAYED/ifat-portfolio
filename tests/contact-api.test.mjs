import test from 'node:test';
import assert from 'node:assert/strict';
import { CONTACT_LIMITS, validateContact } from '../src/lib/contact-rules.mjs';
import { CONTACT_RECIPIENT, createContactRateLimiter, createMailIntent, handleContactRequest, isAllowedOrigin, readSmtpConfiguration, recipientAccepted } from '../src/lib/mail-intent.mjs';

const input = { name: 'Portfolio Visitor', email: 'visitor@example.com', message: 'I would like to discuss a label design for my project.', website: '' };
const env = { SMTP_HOST: 'smtp.gmail.com', SMTP_PORT: '465', SMTP_USER: 'ifatibrahim20@gmail.com', SMTP_PASS: 'test-only-password' };
const request = (body = input, overrides = {}) => new Request('https://portfolio.example/api/contact', {
  method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://portfolio.example' }, body: JSON.stringify(body), ...overrides,
});
function mock(result = { accepted: [CONTACT_RECIPIENT], rejected: [] }) {
  const sent = [];
  const codes = [];
  let closed = 0;
  return {
    sent, codes, get closed() { return closed; },
    options: {
      env,
      rateLimit: () => ({ allowed: true, retryAfter: 0 }),
      onError: (code) => codes.push(code),
      createTransport: () => ({
        sendMail: async (message) => { sent.push(message); if (result instanceof Error) throw result; return result; },
        close: () => { closed++; },
      }),
    },
  };
}

test('validation accepts a real inquiry and trims surrounding whitespace', () => {
  assert.deepEqual(validateContact({ ...input, name: ' Portfolio Visitor ', message: ' A useful project description. ' }), {
    ok: true, data: { name: 'Portfolio Visitor', email: input.email, message: 'A useful project description.' },
  });
});

test('validation rejects header injection, invalid addresses, honeypots, and invalid types', () => {
  for (const invalid of [{ ...input, name: 'Name\r\nBcc: elsewhere@example.com' }, { ...input, email: 'user@example.com\n' + 'Bcc:x@example.com' }, { ...input, website: 'spam.example' }, { ...input, message: [] }, null, []]) {
    assert.equal(validateContact(invalid).ok, false);
  }
});

test('mail intent fixes recipient and SMTP sender while preserving visitor reply-to', () => {
  const intent = createMailIntent(input, env.SMTP_USER);
  assert.equal(intent.to, CONTACT_RECIPIENT);
  assert.deepEqual(intent.envelope, { from: env.SMTP_USER, to: [CONTACT_RECIPIENT] });
  assert.equal(intent.from.address, env.SMTP_USER);
  assert.equal(intent.replyTo.address, input.email);
  assert.match(intent.text, /label design/);
  assert.equal(intent.html, undefined);
});

test('SMTP configuration uses TLS and never accepts missing credentials', () => {
  assert.equal(readSmtpConfiguration({}), null);
  assert.equal(readSmtpConfiguration({ ...env, SMTP_PORT: '25' }), null);
  assert.equal(readSmtpConfiguration({ ...env, SMTP_PASS: '' }), null);
  assert.equal(readSmtpConfiguration({ ...env, SMTP_PORT: '587' }).requireTLS, true);
  assert.equal(readSmtpConfiguration(env).secure, true);
  assert.equal(readSmtpConfiguration({ ...env, SMTP_PASS: 'abcd efgh ijkl mnop' }).auth.pass, 'abcdefghijklmnop');
});

test('SMTP success means that the configured recipient was actually accepted', () => {
  assert.equal(recipientAccepted({ accepted: [CONTACT_RECIPIENT] }), true);
  assert.equal(recipientAccepted({ accepted: ['elsewhere@example.com'] }), false);
  assert.equal(recipientAccepted({ accepted: [CONTACT_RECIPIENT], rejected: [CONTACT_RECIPIENT] }), false);
  assert.equal(recipientAccepted({ messageId: 'not-proof-of-recipient-acceptance' }), false);
});

test('request handler sends one message and confirms only SMTP acceptance', async () => {
  const transport = mock();
  const response = await handleContactRequest(request(), transport.options);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(transport.sent.length, 1);
  assert.equal(transport.sent[0].to, CONTACT_RECIPIENT);
  assert.equal(transport.closed, 1);
});

test('a resolved SMTP call without recipient acceptance returns failure, not fake success', async () => {
  const transport = mock({ accepted: [], rejected: [CONTACT_RECIPIENT] });
  const response = await handleContactRequest(request(), transport.options);
  assert.equal(response.status, 502);
  assert.equal((await response.json()).ok, false);
  assert.deepEqual(transport.codes, ['RECIPIENT_NOT_ACCEPTED']);
  assert.equal(transport.closed, 1);
});

test('SMTP errors return a safe failure and log only the error code', async () => {
  const transport = mock(Object.assign(new Error('A secret transcript must never be returned'), { code: 'EAUTH' }));
  const response = await handleContactRequest(request(), transport.options);
  assert.equal(response.status, 502);
  const text = await response.text();
  assert.doesNotMatch(text, /secret transcript/);
  assert.deepEqual(transport.codes, ['EAUTH']);
  assert.equal(transport.closed, 1);
});

test('missing credentials return 503 without attempting delivery', async () => {
  const transport = mock();
  const response = await handleContactRequest(request(), { ...transport.options, env: {} });
  assert.equal(response.status, 503);
  assert.equal(transport.sent.length, 0);
  assert.match((await response.json()).message, /has not been sent/);
});

test('cross-site and invalid submissions never reach the mail transport', async () => {
  const transport = mock();
  const cross = request(input, { headers: { 'Content-Type': 'application/json', Origin: 'https://untrusted.example' } });
  assert.equal((await handleContactRequest(cross, transport.options)).status, 403);
  assert.equal((await handleContactRequest(request({ ...input, email: 'invalid' }), transport.options)).status, 400);
  assert.equal((await handleContactRequest(request({ ...input, website: 'spam' }), transport.options)).status, 400);
  assert.equal(transport.sent.length, 0);
});

test('trusted preview origins must be exact origins, never domain suffix matches', () => {
  const preview = request(input, { headers: { Origin: 'https://preview.example' } });
  assert.equal(isAllowedOrigin(preview, {}), false);
  assert.equal(isAllowedOrigin(preview, { CONTACT_ALLOWED_ORIGINS: 'https://preview.example' }), true);
  assert.equal(isAllowedOrigin(request(input, { headers: { Origin: 'https://preview.example.attacker.test' } }), { CONTACT_ALLOWED_ORIGINS: 'https://preview.example' }), false);
  assert.equal(isAllowedOrigin(request(input, { headers: { Origin: 'https://preview.example', Host: 'preview.example' } }), {}), true);
});

test('body limit is enforced even when Content-Length is absent', async () => {
  const transport = mock();
  const tooLarge = request({ ...input, message: 'x'.repeat(CONTACT_LIMITS.bodyBytes) });
  const response = await handleContactRequest(tooLarge, transport.options);
  assert.equal(response.status, 413);
  assert.equal(transport.sent.length, 0);
});

test('malformed JSON and wrong content type return real client errors', async () => {
  const transport = mock();
  assert.equal((await handleContactRequest(request(input, { body: '{broken' }), transport.options)).status, 400);
  assert.equal((await handleContactRequest(request(input, { headers: { 'Content-Type': 'text/plain' } }), transport.options)).status, 415);
  assert.equal(transport.sent.length, 0);
});

test('rate limit denies before SMTP and returns a retry interval', async () => {
  const transport = mock();
  const response = await handleContactRequest(request(), { ...transport.options, rateLimit: () => ({ allowed: false, retryAfter: 90 }) });
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('retry-after'), '90');
  assert.equal(transport.sent.length, 0);
});

test('bounded per-process rate limiter expires entries and never grows beyond its cap', () => {
  let clock = 0;
  const limit = createContactRateLimiter({ limit: 2, windowMs: 1000, maxKeys: 2, now: () => clock });
  assert.equal(limit('a').allowed, true);
  assert.equal(limit('a').allowed, true);
  assert.equal(limit('a').allowed, false);
  assert.equal(limit('b').allowed, true);
  assert.equal(limit('c').allowed, false);
  clock = 1001;
  assert.equal(limit('c').allowed, true);
});
