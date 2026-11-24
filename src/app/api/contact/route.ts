import nodemailer from 'nodemailer';
import { handleContactRequest } from '@/lib/mail-intent.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(request: Request) {
  return handleContactRequest(request, {
    createTransport: (configuration) => nodemailer.createTransport(configuration),
    env: process.env,
    onError: (code) => console.error('[contact]', code),
  });
}
