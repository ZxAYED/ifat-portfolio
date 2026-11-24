export function StudyContent() {
  return (
    <main id="main">
      <section
        className="study-hero section-shell"
        aria-labelledby="study-heading"
      >
        <a className="study-back text-link" href="/#work">
          Back to the studies
        </a>
        <div className="study-hero-heading">
          <h1 id="study-heading">The ifat. visual study.</h1>
          <p className="study-hero-description">
            A shared green palette, contrasting type, and simple forms —
            explored through identity, labels, apparel, and campaign layouts.
          </p>
        </div>
        <aside className="study-attribution" aria-label="Artwork attribution">
          <p>
            <strong>Created by ChatGPT for this website concept.</strong>{" "}
            Illustrative studies, not Ifat-authored projects or client
            commissions.
          </p>
        </aside>
        <dl className="study-facts">
          <div>
            <dt>Context</dt>
            <dd>Ifat portfolio website</dd>
          </div>
          <div>
            <dt>Artwork</dt>
            <dd>ChatGPT</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>Illustrative concept studies</dd>
          </div>
          <div>
            <dt>Focus</dt>
            <dd>Type, color &amp; composition</dd>
          </div>
        </dl>
      </section>
      <section
        className="study-opening section-shell"
        id="identity"
        aria-label="Identity layout study"
      >
        <figure className="study-artboard">
          <img
            src="/assets/identity-study.svg"
            width="1200"
            height="900"
            alt="An identity board with a paired geometric mark on green, an italic ifat wordmark on off-white, and two color-study panels"
            fetchPriority="high"
            decoding="async"
          />
          <figcaption>
            The complete identity board: paired mark, wordmark specimen, and
            color studies.
          </figcaption>
        </figure>
      </section>
      <section
        className="study-context section-shell"
        aria-labelledby="context-heading"
      >
        <div>
          <p className="eyebrow">The presentation goal</p>
          <h2 id="context-heading">
            Give the work
            <br />
            room to be seen.
          </h2>
        </div>
        <div className="study-context-copy">
          <p>
            The website’s purpose is to present graphic design clearly: visible
            artwork, readable type, and a consistent visual identity.
          </p>
          <p>
            These studies explore that direction using the portfolio’s supplied
            green and off-white colors. Their common thread is a small set of
            forms and type contrasts, arranged differently for each surface.
          </p>
        </div>
      </section>
      <div className="study-collection section-shell">
        <nav
          className="study-jump-links"
          aria-label="Explore the four illustrative applications"
        >
          <a href="#identity">Brand identity</a>
          <a href="#packaging">Packaging &amp; labels</a>
          <a href="#apparel">Apparel graphics</a>
          <a href="#campaign">Social &amp; campaign</a>
        </nav>
        <section
          className="study-application"
          id="identity-details"
          aria-labelledby="identity-heading"
        >
          <div className="study-application-heading section-heading">
            <div>
              <p className="eyebrow">Brand identity</p>
              <h2 id="identity-heading">Character, made consistent.</h2>
            </div>
            <p className="study-application-intro">
              A paired geometric mark, an italic wordmark, and a green-led
              palette arranged as one identity board.
            </p>
          </div>
          <div
            className="study-details"
            role="group"
            aria-label="Details from the identity board"
          >
            <figure className="study-detail">
              <div className="study-detail-image study-detail-mark">
                <img
                  src="/assets/identity-mark-detail.svg"
                  width="632"
                  height="650"
                  alt="An enlarged detail of the paired geometric mark on green"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>
                <span className="study-detail-label">
                  Detail from the same board
                </span>
                <h3>Mark &amp; form</h3>
                <p>
                  Circles and curved stems create a paired symbol. The large
                  green panel gives its silhouette room to read.
                </p>
              </figcaption>
            </figure>
            <figure className="study-detail">
              <div className="study-detail-image study-detail-type">
                <img
                  src="/assets/identity-type-detail.svg"
                  width="406"
                  height="386"
                  alt="An enlarged detail of the italic ifat wordmark with its small sans-serif supporting type"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>
                <span className="study-detail-label">
                  Detail from the same board
                </span>
                <h3>Type &amp; contrast</h3>
                <p>
                  An italic wordmark sits beside small sans-serif labels,
                  balancing expression with a clear hierarchy.
                </p>
              </figcaption>
            </figure>
          </div>
          <div className="study-color-note">
            <h3>Color &amp; repetition</h3>
            <p>
              Green, deep ink, and pale neutrals repeat across the mark,
              specimen card, and swatches.
            </p>
          </div>
        </section>
        <section
          className="study-application"
          id="packaging"
          aria-labelledby="packaging-heading"
        >
          <div className="study-application-heading section-heading">
            <div>
              <p className="eyebrow">Packaging &amp; labels</p>
              <h2 id="packaging-heading">Small label. Clear story.</h2>
            </div>
            <p className="study-application-intro">
              A flat label composition that separates a headline, supporting
              information, and graphic accents on a compact surface.
            </p>
          </div>
          <figure className="study-artboard">
            <img
              src="/assets/packaging-study.svg"
              width="1200"
              height="900"
              alt="A schematic carton outline and a tilted green-and-off-white label panel, with a large headline and smaller information blocks"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              Illustrative label layouts and a schematic carton outline. No
              physical product or production specification is shown.
            </figcaption>
          </figure>
          <dl className="study-observations">
            <div>
              <dt>Reading order</dt>
              <dd>
                A prominent title leads into smaller information blocks, with
                rules and spacing separating each level.
              </dd>
            </div>
            <div>
              <dt>Structure</dt>
              <dd>
                A schematic carton outline sits beside an enlarged label panel,
                showing the same type and color vocabulary at different scales.
              </dd>
            </div>
            <div>
              <dt>Graphic rhythm</dt>
              <dd>
                Repeated rules, type styles, and green panels connect the two
                views.
              </dd>
            </div>
          </dl>
        </section>
        <section
          className="study-application"
          id="apparel"
          aria-labelledby="apparel-heading"
        >
          <div className="study-application-heading section-heading">
            <div>
              <p className="eyebrow">Apparel graphics</p>
              <h2 id="apparel-heading">Ideas you can wear.</h2>
            </div>
            <p className="study-application-intro">
              A typographic graphic shown on a flat T-shirt silhouette and as a
              separate composition.
            </p>
          </div>
          <figure className="study-artboard">
            <img
              src="/assets/apparel-study.svg"
              width="1200"
              height="900"
              alt="A dark T-shirt illustration with Ideas take shape lettering and three green shapes, beside the same graphic on a light panel"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              The same typographic idea on a flat shirt silhouette and a
              separate artwork panel.
            </figcaption>
          </figure>
          <dl className="study-observations">
            <div>
              <dt>Words as image</dt>
              <dd>
                The phrase “Ideas take shape” combines bold sans-serif words
                with an italic middle line.
              </dd>
            </div>
            <div>
              <dt>Graphic accents</dt>
              <dd>
                A circle, square, and triangle echo the theme of shape beneath
                the lettering.
              </dd>
            </div>
            <div>
              <dt>Placement</dt>
              <dd>
                The centered arrangement appears at two scales: on the shirt
                silhouette and on a light artwork panel.
              </dd>
            </div>
          </dl>
        </section>
        <section
          className="study-application"
          id="campaign"
          aria-labelledby="campaign-heading"
        >
          <div className="study-application-heading section-heading">
            <div>
              <p className="eyebrow">Social &amp; campaign</p>
              <h2 id="campaign-heading">One idea. Four compositions.</h2>
            </div>
            <p className="study-application-intro">
              A shared visual language across four campaign-style artboards,
              using repeated colors, contrasting type, and geometric forms.
            </p>
          </div>
          <figure className="study-artboard">
            <img
              src="/assets/campaign-study.svg"
              width="1200"
              height="900"
              alt="Four coordinated campaign-style artboards with large typographic messages and geometric forms in green, ink, and pale neutrals"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              Four compositions connected by color, typography, and recurring
              geometric forms.
            </figcaption>
          </figure>
          <dl className="study-observations">
            <div>
              <dt>Recurring elements</dt>
              <dd>
                Green, ink, contrasting type, and simple shapes connect the set.
              </dd>
            </div>
            <div>
              <dt>Changing emphasis</dt>
              <dd>
                One panel leads with a large statement; others use a wider text
                layout, a geometric motif, or a shorter stacked message.
              </dd>
            </div>
            <div>
              <dt>A connected set</dt>
              <dd>
                The arrangements vary while their colors, type, and graphic
                vocabulary remain familiar.
              </dd>
            </div>
          </dl>
        </section>
      </div>
      <section
        className="study-reflection section-shell"
        aria-labelledby="reflection-heading"
      >
        <p className="eyebrow">A visual reflection</p>
        <div className="study-reflection-copy">
          <h2 id="reflection-heading">
            Repetition.
            <br />
            With room for variation.
          </h2>
          <p>
            The clearest thread is repetition with variation: the palette stays
            recognizable while type, framing, and image balance change. Each
            board can be read on its own, while the shared visual vocabulary
            holds the set together.
          </p>
        </div>
      </section>
      <section className="study-next" aria-labelledby="next-heading">
        <div className="section-shell study-next-inner">
          <div>
            <p className="eyebrow">Continue the conversation</p>
            <h2 id="next-heading">
              Have a project
              <br />
              in mind?
            </h2>
          </div>
          <div>
            <p>
              Explore Ifat’s portfolio and get in touch about design projects or
              creative opportunities.
            </p>
            <div className="study-next-actions">
              <a className="button button-dark" href="/#contact">
                Contact Ifat
              </a>
              <a
                className="text-link"
                href="https://www.behance.net/designedwithifat"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Behance portfolio
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
            <a className="study-home-link text-link" href="/">
              Return to the portfolio
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
