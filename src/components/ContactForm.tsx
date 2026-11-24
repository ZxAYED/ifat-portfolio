"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CONTACT_LIMITS, validateContact } from "@/lib/contact-rules.mjs";

type FieldName = "name" | "email" | "message" | "website";
type FieldErrors = Partial<Record<FieldName, string>>;
type SubmissionState = "idle" | "pending" | "success" | "error";

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<SubmissionState>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    setReady(true);
    return () => requestRef.current?.abort();
  }, []);

  function focusFirstError(nextErrors: FieldErrors) {
    const first = (["name", "email", "message"] as const).find(
      (name) => nextErrors[name],
    );
    if (first)
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  useEffect(() => {
    if (state === "error") focusFirstError(errors);
  }, [state, errors]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "pending" || requestRef.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const input = Object.fromEntries(
      ["name", "email", "message", "website"].map((name) => [
        name,
        data.get(name) ?? "",
      ]),
    );
    const checked = validateContact(input);
    if (!checked.ok) {
      setErrors(checked.errors);
      setState("error");
      setStatus(
        checked.errors.website || "Please check the highlighted fields.",
      );
      return;
    }
    setErrors({});
    setState("pending");
    setStatus("Sending your message…");
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...checked.data, website: "" }),
        signal: controller.signal,
        credentials: "same-origin",
      });
      const result: { ok?: boolean; message?: string; errors?: FieldErrors } =
        await response.json();
      if (!response.ok || result.ok !== true) {
        setState("error");
        setErrors(result.errors || {});
        setStatus(
          result.message ||
            "We couldn’t confirm that your message was sent. Please try again later, or use the email link below.",
        );
        // Do not reset inputs on any failure.
        return;
      }
      setState("success");
      setStatus(
        result.message ||
          "Your message is on its way. Thank you for getting in touch.",
      );
      form.reset();
    } catch {
      if (controller.signal.aborted) return;
      setState("error");
      setStatus(
        "We couldn’t confirm that your message was sent. Your draft is still here. Please try again later, or email Ifat directly.",
      );
    } finally {
      if (requestRef.current === controller) requestRef.current = null;
    }
  }

  return (
    <form
      ref={formRef}
      className="contact-form"
      onSubmit={submit}
      noValidate
      aria-labelledby="contact-form-heading"
      aria-busy={state === "pending"}
    >
      <div className="contact-form-heading">
        <h3 id="contact-form-heading">Tell me about your project.</h3>
        <p>Share the idea, who it’s for, and the timing you have in mind.</p>
      </div>
      <fieldset className="contact-form-grid" disabled={state === "pending"}>
        <legend className="sr-only">Your project inquiry</legend>
        <div className="contact-field">
          <label htmlFor="contact-name">Your name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={CONTACT_LIMITS.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            placeholder="How should I call you?"
          />
          {errors.name && (
            <p className="contact-field-error" id="contact-name-error">
              {errors.name}
            </p>
          )}
        </div>
        <div className="contact-field">
          <label htmlFor="contact-email">Email address</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={CONTACT_LIMITS.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="contact-field-error" id="contact-email-error">
              {errors.email}
            </p>
          )}
        </div>
        <div className="contact-field contact-field--wide">
          <label htmlFor="contact-message">What are you making?</label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            minLength={10}
            maxLength={CONTACT_LIMITS.message}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message ? "contact-message-error" : "contact-message-help"
            }
            placeholder="A little about the idea, the deliverables, and your timeline…"
          />
          {errors.message ? (
            <p className="contact-field-error" id="contact-message-error">
              {errors.message}
            </p>
          ) : (
            <p className="contact-form-help" id="contact-message-help">
              Up to 5,000 characters.
            </p>
          )}
        </div>
        <div className="contact-honeypot" aria-hidden="true">
          <label htmlFor="contact-website">Leave this field empty</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
      </fieldset>
      <div className="contact-form-actions">
        <button
          className="button button-dark"
          type="submit"
          disabled={!ready || state === "pending"}
        >
          {state === "pending" ? "Sending…" : "Send message"}
        </button>
        <a className="text-link" href="mailto:ifatibrahim20@gmail.com">
          Or email Ifat directly
        </a>
      </div>
      <p
        className="contact-form-status"
        data-state={state}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {status}
      </p>
      <noscript>
        <p className="contact-form-help">
          JavaScript is needed to send this form. You can email{" "}
          <a href="mailto:ifatibrahim20@gmail.com">ifatibrahim20@gmail.com</a>{" "}
          directly.
        </p>
      </noscript>
    </form>
  );
}
