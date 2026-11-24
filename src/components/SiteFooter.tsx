export default function SiteFooter({ home = true }: { home?: boolean }) {
  return (
    <footer className="site-footer section-shell">
      <a
        className="footer-name"
        href={home ? "#top" : "/"}
        aria-label="Ifat Ibrahim, back to top"
      >
        ifat<span aria-hidden="true">.</span>
      </a>
      <div className="footer-bottom">
        <p>Graphic designer · Bangladesh</p>
        <p>
          Portfolio concept · <span id="year">2026</span>
        </p>
        <div className="footer-actions">
          <a className="text-link" href="#top">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
