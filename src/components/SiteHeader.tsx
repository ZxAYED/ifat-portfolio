import ThemeToggle from "@/components/ThemeToggle";

export default function SiteHeader({ home = true }: { home?: boolean }) {
  return (
    <header className="site-header">
      {home && <span className="scroll-progress" aria-hidden="true" />}
      <a
        className="brand"
        href={home ? "#top" : "/"}
        aria-label="Ifat Ibrahim, home"
      >
        <span className="brand-symbol" aria-hidden="true">
          if.
        </span>
        <span className="brand-name">
          Ifat Ibrahim<span>Graphic designer</span>
        </span>
      </a>
      <div className="header-right">
        <nav
          className="main-nav"
          data-lenis-prevent=""
          id="main-navigation"
          aria-label="Main navigation"
        >
          <a href={home ? "#work" : "/#work"}>Work</a>
          <a href={home ? "#expertise" : "/#expertise"}>Expertise</a>
          <a href={home ? "#about" : "/#about"}>About</a>
          <a href={home ? "#process" : "/#process"}>Process</a>
          <a className="nav-contact" href={home ? "#contact" : "/#contact"}>
            Let’s talk
          </a>
        </nav>
        <ThemeToggle />
        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation menu"
          aria-controls="main-navigation"
          aria-expanded="false"
        >
          <span>Menu</span>
          <span className="menu-lines" aria-hidden="true"></span>
        </button>
      </div>
    </header>
  );
}
