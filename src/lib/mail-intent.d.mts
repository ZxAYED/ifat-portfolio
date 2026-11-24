import type { ContactData } from './contact-rules.mjs';

export const CONTACT_RECIPIENT: 'ifatibrahim20@gmail.com';
export type SmtpConfiguration = {
  host: string; port: number; secure: boolean; requireTLS: boolean;
  auth: { user: string; pass: string };
  connectionTimeout: number; greetingTimeout: number; socketTimeout: number; dnsTimeout: number;
  disableFileAccess: boolean; disableUrlAccess: boolean; logger: false; debug: false;
};
export type MailIntent = {
  from: { name: string; address: string };
  to: string;
  replyTo: { name: string; address: string };
  envelope: { from: string; to: string[] };
  subject: string; text: string; disableFileAccess: boolean; disableUrlAccess: boolean;
};
export type MailResult = { accepted?: Array<string | { address: string }>; rejected?: Array<string | { address: string }> };
export type RateResult = { allowed: boolean; retryAfter: number };
export function readSmtpConfiguration(env: Record<string, string | undefined>): SmtpConfiguration | null;
export function createMailIntent(contact: ContactData, sender: string): MailIntent;
export function recipientAccepted(info: MailResult): boolean;
export function createContactRateLimiter(options?: { limit?: number; windowMs?: number; maxKeys?: number; now?: () => number }): (key: string) => RateResult;
export function isAllowedOrigin(request: Request, env: Record<string, string | undefined>): boolean;
export function handleContactRequest(request: Request, dependencies: {
  createTransport: (configuration: SmtpConfiguration) => { sendMail: (mail: MailIntent) => Promise<MailResult>; close?: () => void };
  env?: Record<string, string | undefined>;
  rateLimit?: (key: string) => RateResult;
  onError?: (code: string) => void;
}): Promise<Response>;
