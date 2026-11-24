# Contact form: Gmail and Nodemailer

The form posts to `/api/contact` in the Next.js Node runtime. Its only delivery destination is **ifatibrahim20@gmail.com**, supplied by the portfolio owner. The visitor’s validated address is set as `Reply-To`; the sender remains the authenticated SMTP account.

## Get a new Gmail App Password

1. Sign in to the Google account you will use as the sender.
2. Enable **2-Step Verification** in your [Google Account security settings](https://myaccount.google.com/security).
3. Open [App passwords](https://myaccount.google.com/apppasswords), sign in again if prompted, and create an entry named **Ifat portfolio**.
4. Copy the generated App Password into `SMTP_PASS` in your local `.env.local`, or your hosting provider’s server-side environment variables. Do this privately. Use the App Password rather than your normal Google password.
5. Restart the development server. On a hosted deployment, save the environment changes and redeploy/restart as your provider requires.

If you forgot the previous App Password, Google cannot show it again. Generate a new one and remove the unused entry. Changing your Google Account password revokes existing App Passwords. Some managed accounts, Advanced Protection accounts, and security-key-only configurations do not offer this feature. These details are documented in [Google’s App Password help](https://support.google.com/accounts/answer/185833?hl=en).

## Environment configuration

From the `frontend` folder, copy `.env.example` to `.env.local` if needed, and set:

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=ifatibrahim20@gmail.com
SMTP_PASS=your_new_app_password_here
```

The value above is a placeholder, not a credential. Gmail may display the password in groups; the server removes its whitespace for `smtp.gmail.com`. `SMTP_USER` must be the account that generated it. Port 465 uses TLS from connection start. Port 587 is also supported and requires STARTTLS. See [Nodemailer’s SMTP options](https://nodemailer.com/smtp).

Keep credentials out of `NEXT_PUBLIC_*` variables, source control, ZIPs, browser code, and chat messages. The included `.env` contains no real password.

The recipient is fixed in `src/lib/mail-intent.mjs`. It is intentionally not controlled by the request body, so the form cannot be used to send messages to arbitrary addresses.

## Preview and production origins

The API accepts the request’s own origin, its ordinary Host header, and configured `SITE_URL` / `NEXT_PUBLIC_SITE_URL`. If a trusted reverse proxy changes the host, add only the exact permitted public origins:

```dotenv
CONTACT_ALLOWED_ORIGINS=https://your-preview.example,https://your-domain.example
```

Do not use wildcard domains. Browser requests explicitly marked cross-site are rejected. Origin checks are an abuse control, not user authentication.

## Check the complete path

1. Start the app, fill in your own contact details, and send one clearly labeled test inquiry after you configure credentials.
2. A successful response appears only when Nodemailer reports that the configured recipient was accepted by SMTP. Confirm that the message then arrives in the Gmail inbox or spam folder; SMTP acceptance alone cannot guarantee inbox placement.
3. Press Reply in the received message and check that it addresses the email entered in the form.
4. If delivery fails, the form keeps the draft and shows an error. Missing credentials return 503; SMTP/authentication errors return 502. A response never pretends a message was sent.

No real email was sent during package verification. Automated tests use an injected mock mail transport and check accepted, rejected, missing-credential, invalid-input, oversized-body, and rate-limit paths.

The contact form requires a **Next.js Node server** with outbound SMTP access. A static HTML export cannot execute this API. Gmail may reject server connections or impose account sending limits; [Nodemailer’s Gmail guide](https://nodemailer.com/guides/using-gmail) covers supported authentication and delivery constraints. OAuth2 or a transactional SMTP service can be used later if the portfolio receives more traffic.

## Abuse protection and privacy

Validation runs in the browser and again on the server. The API rejects header controls, invalid emails, filled honeypots, non-JSON input, and bodies over 24 KB. A five-attempt, fifteen-minute limiter uses bounded process memory and hashes the available proxy-supplied IP, or the email when the IP is absent. It resets on process restart and is not shared across server instances; use the hosting provider’s rate protection or a shared store if traffic warrants it. Configure your proxy to sanitize `X-Forwarded-For` before relying on that header.

The application does not log message contents or SMTP credentials. Failure logs contain only a short error code such as `EAUTH`. It sends no automatic reply or subscription to the visitor.

## Troubleshooting

- **503:** SMTP configuration is absent or invalid. Check the server environment and restart.
- **502 / EAUTH:** Check the sender account and App Password; a revoked password must be replaced.
- **502 / timeout:** Confirm the host permits outbound SMTP and review Google’s account security alerts.
- **403:** Check the public site origin and any trusted preview entry.
- **429:** Wait for the retry interval or use the direct email link.

Official references checked on 24 November 2026: [Google App Passwords](https://support.google.com/accounts/answer/185833?hl=en), [Nodemailer Gmail](https://nodemailer.com/guides/using-gmail), [Nodemailer SMTP](https://nodemailer.com/smtp), and [Nodemailer sendMail results](https://nodemailer.com/about/).
