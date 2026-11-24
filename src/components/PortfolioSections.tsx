import ContactForm from "@/components/ContactForm";

export function Hero() {
  return (
    <section className="hero section-shell" aria-labelledby="hero-heading">
      <div className="hero-copy">
        <p className="eyebrow hero-kicker">
          <span className="small-rule"></span> Graphic designer
        </p>
        <h1 id="hero-heading">
          <span className="headline-line">Good ideas,</span>
          <span className="headline-line">
            <em>made visual.</em>
          </span>
        </h1>
        <p className="hero-description">
          I’m Ifat Ibrahim. I turn ideas into thoughtful identities, packaging,
          and graphics with a character of their own.
        </p>
        <div className="hero-actions">
          <a className="button button-dark" href="#work">
            Explore the work
          </a>
          <a className="text-link" href="#contact">
            Let’s talk
          </a>
        </div>
        <div className="hero-signoff">
          <span>Based in Bangladesh</span>
          <span className="signoff-divider" aria-hidden="true"></span>
          <span>Built around the details</span>
        </div>
      </div>
      <div
        className="hero-art"
        role="img"
        aria-label="A website identity study: typography, geometric forms and the portfolio’s brand colors"
      >
        <div className="artboard-guides" aria-hidden="true">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </div>
        <div className="art-sheet art-sheet-main">
          <span className="sheet-micro">DESIGNED WITH IFAT</span>
          <div className="hero-monogram" aria-hidden="true">
            <span></span>
            <span></span>
          </div>
          <div className="sheet-bottom">
            <span>
              Clarity.
              <br />
              Character.
              <br />
              Craft.
            </span>
            <span className="sheet-mark" aria-hidden="true">
              if.
            </span>
          </div>
        </div>
        <div className="art-sheet type-note">
          <span className="sheet-micro">A LITTLE TYPE EXPLORATION</span>
          <p>
            Make it
            <br />
            <em>mean</em>
            <br />
            something.
          </p>
          <span className="type-note-foot">Thoughtful by design.</span>
        </div>
        <div className="swatch-card">
          <div className="swatch-main"></div>
          <div className="swatch-copy">
            <span>Brand green</span>
            <span>#25A36F</span>
          </div>
        </div>
        <div className="composition-label">
          <span className="tiny-cross" aria-hidden="true"></span> A website
          identity, taking shape.
        </div>
      </div>
    </section>
  );
}

export function DisciplineStrip() {
  return (
    <div
      className="discipline-strip"
      role="group"
      aria-label="Design disciplines"
    >
      <span>Brand identity</span>
      <i aria-hidden="true">/</i>
      <span>Packaging &amp; labels</span>
      <i aria-hidden="true">/</i>
      <span>Apparel graphics</span>
      <i aria-hidden="true">/</i>
      <span>Visual stories</span>
    </div>
  );
}

export function Expertise() {
  return (
    <section
      className="expertise-section section-shell"
      id="expertise"
      aria-labelledby="expertise-heading"
    >
      <div className="section-heading reveal">
        <div>
          <p className="eyebrow">What I work on</p>
          <h2 id="expertise-heading">
            Different formats.
            <br />
            The same care.
          </h2>
        </div>
        <p className="heading-aside">
          From a first impression to the smallest printed detail, every element
          has a job to do.
        </p>
      </div>
      <div className="expertise-layout">
        <div className="expertise-list">
          <details
            open
            className="expertise-row"
            data-preview="identity"
            data-preview-src="/assets/identity-study.svg"
            data-preview-label="Brand identity · concept study"
          >
            <summary>
              <span>Brand identity</span>
              <span className="expertise-summary">
                A recognizable visual language
              </span>
              <span className="details-icon" aria-hidden="true"></span>
            </summary>
            <div className="expertise-content">
              <p>
                Logos, typography, and color that feel connected. A consistent
                visual direction across the places a brand appears.
              </p>
              <div className="service-example">
                <p className="deliverables">
                  Logo design / Color &amp; type / Brand applications
                </p>
                <a
                  className="text-link"
                  href="/work/visual-language-study/#identity"
                >
                  Explore the identity study
                </a>
              </div>
            </div>
          </details>
          <details
            className="expertise-row"
            data-preview="packaging"
            data-preview-src="/assets/packaging-study.svg"
            data-preview-label="Packaging & labels · concept study"
          >
            <summary>
              <span>Packaging &amp; labels</span>
              <span className="expertise-summary">
                Clarity, down to the small print
              </span>
              <span className="details-icon" aria-hidden="true"></span>
            </summary>
            <div className="expertise-content">
              <p>
                Product information shaped into balanced layouts, with attention
                to hierarchy, dimensions, brand consistency, and print
                requirements.
              </p>
              <div className="service-example">
                <p className="deliverables">
                  Product labels / Packaging graphics / Print layouts
                </p>
                <a
                  className="text-link"
                  href="/work/visual-language-study/#packaging"
                >
                  View the packaging study
                </a>
              </div>
            </div>
          </details>
          <details
            className="expertise-row"
            data-preview="apparel"
            data-preview-src="/assets/apparel-study.svg"
            data-preview-label="Apparel graphics · concept study"
          >
            <summary>
              <span>Apparel graphics</span>
              <span className="expertise-summary">
                Personality in something wearable
              </span>
              <span className="details-icon" aria-hidden="true"></span>
            </summary>
            <div className="expertise-content">
              <p>
                Typography and graphic compositions made to work on T-shirts and
                apparel, with careful spacing, color, and visual balance.
              </p>
              <div className="service-example">
                <p className="deliverables">
                  T-shirt artwork / Typographic graphics / Collections
                </p>
                <a
                  className="text-link"
                  href="/work/visual-language-study/#apparel"
                >
                  View the apparel study
                </a>
              </div>
            </div>
          </details>
          <details
            className="expertise-row"
            data-preview="campaign"
            data-preview-src="/assets/campaign-study.svg"
            data-preview-label="Social & campaign · concept study"
          >
            <summary>
              <span>Social &amp; campaign</span>
              <span className="expertise-summary">
                One idea, expressed consistently
              </span>
              <span className="details-icon" aria-hidden="true"></span>
            </summary>
            <div className="expertise-content">
              <p>
                Clear, engaging promotional graphics that carry a consistent
                idea across posts, formats, and marketing materials.
              </p>
              <div className="service-example">
                <p className="deliverables">
                  Social graphics / Promotional layouts / Visual campaigns
                </p>
                <a
                  className="text-link"
                  href="/work/visual-language-study/#campaign"
                >
                  View the campaign study
                </a>
              </div>
            </div>
          </details>
        </div>
        <figure className="expertise-preview">
          <div className="expertise-preview-top">
            <span className="eyebrow">A visual language</span>
            <span aria-hidden="true">if.</span>
          </div>
          <div className="expertise-preview-art">
            <img
              src="/assets/identity-study.svg"
              width="1200"
              height="900"
              loading="lazy"
              alt="Brand identity concept study"
            />
          </div>
          <figcaption>
            <span className="expertise-preview-label">
              Brand identity · concept study
            </span>
            <span>Form follows the idea.</span>
          </figcaption>
        </figure>
      </div>
      <div className="digital-note">
        <p>
          <strong>Also exploring</strong> UI and landing-page design — a growing
          area of interest and practice.
        </p>
        <a className="text-link" href="#playground">
          Explore a little visual experiment
        </a>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section
      className="about-section section-shell"
      id="about"
      aria-labelledby="about-heading"
    >
      <div className="about-intro reveal">
        <p className="eyebrow">The person behind the pixels</p>
        <h2 id="about-heading">Hi, I’m Ifat.</h2>
      </div>
      <figure className="designer-portrait">
        <div className="portrait-stage">
          <p className="portrait-topline">The designer</p>
          <img
            className="portrait-image"
            src="/assets/ifat-ibrahim-800.webp"
            srcSet="/assets/ifat-ibrahim-480.webp 480w, /assets/ifat-ibrahim-800.webp 800w"
            sizes="(max-width: 600px) calc(100vw - 60px), (max-width: 1000px) 43vw, 458px"
            width="800"
            height="800"
            alt="Portrait of Ifat Ibrahim"
            loading="lazy"
            decoding="async"
          />
        </div>
        <figcaption className="portrait-caption">
          <strong>Ifat Ibrahim</strong>
          <span>Graphic designer</span>
        </figcaption>
      </figure>
      <div className="about-body reveal">
        <p className="about-lead">
          I’m a graphic designer based in Bangladesh, interested in how
          typography, color and composition make an idea clear.
        </p>
        <p>
          My focus spans identity, product labels, apparel and social graphics.
          I’m also exploring UI and landing-page design.
        </p>
        <div className="tools-block">
          <span className="eyebrow">Tools I use</span>
          <ul className="tool-list">
            <li>
              <span className="tool-icon illustrator" aria-hidden="true">
                <img
                  src="/assets/tools/Adobe_Illustrator.png"
                  width="32"
                  height="32"
                  alt=""
                  loading="lazy"
                />
              </span>
              Illustrator
            </li>
            <li>
              <span className="tool-icon photoshop" aria-hidden="true">
                <img
                  src="/assets/tools/Adobe_Photoshop.png"
                  width="32"
                  height="32"
                  alt=""
                  loading="lazy"
                />
              </span>
              Photoshop
            </li>
            <li>
              <span className="tool-icon figma" aria-hidden="true">
                <img
                  src="/assets/tools/figma.png"
                  width="32"
                  height="32"
                  alt=""
                  loading="lazy"
                />
              </span>
              Figma
            </li>
            <li>
              <span className="tool-icon premiere" aria-hidden="true">
                <img
                  src="/assets/tools/Adobe_Premiere_Pro.png"
                  width="32"
                  height="32"
                  alt=""
                  loading="lazy"
                />
              </span>
              Premiere Pro
            </li>
          </ul>
        </div>
      </div>
      <div className="experience-block reveal">
        <div className="experience-title">
          <p className="eyebrow">Professional experience</p>
          <h3>
            Labels, built around
            <br />
            the details.
          </h3>
          <div className="role-line">
            <strong>Carrydel</strong>
            <span>Product Label Designer</span>
          </div>
        </div>
        <div className="experience-details">
          <p>
            Designed labels around brand guidelines and product requirements,
            prepared print-ready layouts, and refined consistent variations
            through team feedback.
          </p>
          <p className="experience-focus">
            Label hierarchy / Print preparation / Consistent variations
          </p>
        </div>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section
      className="process-section section-shell"
      id="process"
      aria-labelledby="process-heading"
    >
      <div className="section-heading reveal">
        <div>
          <p className="eyebrow">How I approach design</p>
          <h2 id="process-heading">
            An idea,
            <br />
            taking shape.
          </h2>
        </div>
        <p className="heading-aside">
          A framework for moving from a clear message to a considered visual
          result.
        </p>
      </div>
      <div className="process-layout">
        <div className="process-stages">
          <article className="process-stage is-active" data-stage="understand">
            <span className="stage-word">Understand</span>
            <h3>Find the idea that matters.</h3>
            <p>
              Start with the message, the audience, and where the design will
              live. Make the purpose clear before choosing the visuals.
            </p>
            <p className="stage-output">
              <span>A clear starting point</span> Brief / References / Direction
            </p>
            <div className="process-mini mini-brief" aria-hidden="true">
              <span>The starting point</span>
              <strong>
                A clear
                <br />
                <em>idea.</em>
              </strong>
              <div>
                <i>Message</i>
                <i>Audience</i>
                <i>Context</i>
              </div>
            </div>
          </article>
          <article className="process-stage" data-stage="explore">
            <span className="stage-word">Explore</span>
            <h3>Give the idea room to grow.</h3>
            <p>
              Try different type, color, and composition directions. Look for a
              visual language that fits the message and feels distinctive.
            </p>
            <p className="stage-output">
              <span>A visual direction</span> Sketches / Type / Color
            </p>
            <div className="process-mini mini-explore" aria-hidden="true">
              <span>Find a direction</span>
              <div>
                <b>Aa</b>
                <b>Aa</b>
                <b>Aa</b>
              </div>
              <small>Type. Tone. Possibility.</small>
            </div>
          </article>
          <article className="process-stage" data-stage="refine">
            <span className="stage-word">Refine</span>
            <h3>Make every detail earn its place.</h3>
            <p>
              Use feedback to improve the strongest direction. Adjust spacing,
              hierarchy, and consistency across the final layouts.
            </p>
            <p className="stage-output">
              <span>A cohesive design</span> Feedback / Balance / Consistency
            </p>
            <div className="process-mini mini-refine" aria-hidden="true">
              <span>Bring it into balance</span>
              <strong>if.</strong>
              <small>Proportion / spacing / hierarchy</small>
            </div>
          </article>
          <article className="process-stage" data-stage="deliver">
            <span className="stage-word">Deliver</span>
            <h3>Get it ready for the real world.</h3>
            <p>
              Check dimensions, file formats, and the intended medium. Prepare
              the final artwork with its use in mind.
            </p>
            <p className="stage-output">
              <span>Ready-to-use artwork</span> Final checks / Formats / Handoff
            </p>
            <div className="process-mini mini-deliver" aria-hidden="true">
              <span>Ready for its next chapter</span>
              <img
                src="/assets/identity-study.svg"
                width="1200"
                height="900"
                loading="lazy"
                alt=""
              />
              <small>A connected visual language.</small>
            </div>
          </article>
        </div>
        <div
          className="process-visual"
          data-stage="understand"
          aria-hidden="true"
        >
          <div className="process-art-header">
            <span className="process-visual-label">
              Understanding the brief
            </span>
            <span>if.</span>
          </div>
          <div className="process-visual-grid"></div>
          <div className="process-lines">
            <span>Idea</span>
            <span>Audience</span>
            <span>Context</span>
          </div>
          <div className="process-center">
            <span className="process-shape a"></span>
            <span className="process-shape b"></span>
            <span className="process-shape c"></span>
            <span className="process-shape d"></span>
          </div>
          <div className="process-color-chips">
            <i></i>
            <i></i>
            <i></i>
          </div>
          <div className="process-art-caption">
            An illustrated design approach.
          </div>
          <div className="process-progress-track" aria-hidden="true">
            <span className="process-progress"></span>
          </div>
        </div>
      </div>
      <p className="process-context">
        An illustrative look at the approach, using this website’s visual
        identity.
      </p>
    </section>
  );
}

export function Contact() {
  return (
    <section
      className="contact-section"
      id="contact"
      aria-labelledby="contact-heading"
    >
      <div className="contact-art" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
      </div>
      <div className="section-shell">
        <p className="eyebrow">Ideas, opportunities &amp; good conversations</p>
        <div className="contact-layout">
          <h2 id="contact-heading">
            Let’s make it
            <br />
            <em>mean something.</em>
          </h2>
          <div className="contact-aside">
            <p>
              Have a design project in mind, a creative opportunity, or
              something worth exploring together?
            </p>
            <a
              className="button button-dark"
              href="https://www.behance.net/designedwithifat"
              target="_blank"
              rel="noopener noreferrer"
            >
              Connect on Behance
            </a>
            <p className="contact-note">
              Tell me what you’re making, who it’s for, and the timing.
            </p>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
