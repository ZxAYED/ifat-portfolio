import "@/styles/case-study.css";
export default function NotFound() {
  return (
    <main
      className="section-shell"
      style={{ paddingBlock: "min(18vh, 10rem)", minHeight: "100svh" }}
    >
      <a className="brand" href="/">
        <span className="brand-symbol" aria-hidden="true">
          if.
        </span>
        <span>Ifat Ibrahim</span>
      </a>
      <p className="eyebrow" style={{ marginTop: "4rem" }}>
        Page not found
      </p>
      <h1
        style={{
          fontSize: "clamp(3rem, 7vw, 6rem)",
          maxWidth: "15ch",
          marginBlock: "1.5rem",
        }}
      >
        Let’s get back
        <br />
        to the work.
      </h1>
      <p>
        This page may have moved. The portfolio and contact details are still
        here.
      </p>
      <a className="button button-dark" href="/" style={{ marginTop: "2rem" }}>
        Return to the portfolio
      </a>
    </main>
  );
}
