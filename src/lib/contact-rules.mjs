/** Shared, dependency-free validation. Never put SMTP configuration in this file. */
export const CONTACT_LIMITS = Object.freeze({ name: 80, email: 254, message: 5000, bodyBytes: 24_000 });

const EMAIL = /^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/;
const HEADER_CONTROL = /[\u0000-\u001f\u007f]/;

/** @param {unknown} value */
export function isEmail(value) {
  return typeof value === 'string' && value.length <= CONTACT_LIMITS.email && EMAIL.test(value);
}

/**
 * @param {unknown} input
 * @returns {{ok: true, data: {name: string, email: string, message: string}} | {ok: false, errors: Partial<Record<'name'|'email'|'message'|'website', string>>}}
 */
export function validateContact(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, errors: { message: 'Please complete the form and try again.' } };
  }
  const source = /** @type {Record<string, unknown>} */ (input);
  const name = typeof source.name === 'string' ? source.name.trim() : '';
  const email = typeof source.email === 'string' ? source.email.trim() : '';
  const message = typeof source.message === 'string' ? source.message.trim().replace(/\r\n/g, '\n') : '';
  /** @type {Partial<Record<'name'|'email'|'message'|'website', string>>} */
  const errors = {};
  if (!name || name.length > CONTACT_LIMITS.name || HEADER_CONTROL.test(name)) {
    errors.name = 'Please enter your name, using 80 characters or fewer.';
  }
  if (!isEmail(email)) errors.email = 'Please enter a valid email address.';
  if (message.length < 10 || message.length > CONTACT_LIMITS.message || /[\u0000\u000b\u000c\u007f]/.test(message)) {
    errors.message = 'Tell me a little about your project, using 10–5,000 characters.';
  }
  if (source.website !== undefined && (typeof source.website !== 'string' || source.website.trim())) {
    errors.website = 'This submission could not be accepted. Please email Ifat directly.';
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data: { name, email, message } };
}
