export type ContactData = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<'name' | 'email' | 'message' | 'website', string>>;
export const CONTACT_LIMITS: Readonly<{ name: number; email: number; message: number; bodyBytes: number }>;
export function isEmail(value: unknown): boolean;
export function validateContact(input: unknown): { ok: true; data: ContactData } | { ok: false; errors: ContactErrors };
