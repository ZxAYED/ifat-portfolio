export function WorkGallery() {
  return (
    <section
      className="work-section section-shell"
      id="work"
      aria-labelledby="work-heading"
    >
      <div className="section-heading reveal">
        <div>
          <p className="eyebrow">Website layout studies</p>
          <h2 id="work-heading">
            One visual language.
            <br />
            Four studies.
          </h2>
        </div>
        <div className="heading-aside">
          <p>
            Green, contrasting type and simple forms connect a coordinated
            visual exploration.
          </p>
          <a className="text-link" href="/work/visual-language-study/">
            Read the complete study
          </a>
        </div>
      </div>
      <div className="work-note">
        <span className="note-label">Portfolio concept</span>
        <p>
          Created by ChatGPT for this website concept. These illustrative layout
          studies are not presented as Ifat’s original work or client
          commissions.
        </p>
      </div>
      <div className="work-grid">
        <article
          className="work-card work-card--feature reveal"
          id="study-identity"
          data-category="identity"
        >
          <a
            className="artwork-button"
            href="/work/visual-language-study/#identity"
            data-study="identity"
            aria-haspopup="dialog"
            aria-label="Explore study: Character, made consistent."
          >
            <span className="work-art artwork-frame">
              <img
                src="/assets/identity-study.svg"
                alt="An identity board with a paired geometric mark, an italic ifat wordmark and color-study panels"
                width="1200"
                height="900"
                loading="lazy"
              />
            </span>
            <div className="work-caption">
              <div>
                <p className="eyebrow">Brand identity · Layout study</p>
                <h3>Character, made consistent.</h3>
                <p className="card-description">
                  A geometric mark, contrasting type and a restrained palette
                  form the starting point for the collection.
                </p>
              </div>
              <span className="card-action">
                Explore study{" "}
                <span className="caption-symbol" aria-hidden="true">
                  +
                </span>
              </span>
            </div>
          </a>
        </article>
        <article
          className="work-card reveal"
          id="study-packaging"
          data-category="packaging"
        >
          <a
            className="artwork-button"
            href="/work/visual-language-study/#packaging"
            data-study="packaging"
            aria-haspopup="dialog"
            aria-label="Explore study: Small label. Clear story."
          >
            <span className="work-art artwork-frame">
              <img
                src="/assets/packaging-study.svg"
                alt="A schematic carton outline and an enlarged label composition with contrasting type and green panels"
                width="1200"
                height="900"
                loading="lazy"
              />
            </span>
            <div className="work-caption">
              <div>
                <p className="eyebrow">Packaging &amp; labels · Layout study</p>
                <h3>Small label. Clear story.</h3>
              </div>
              <span className="card-action">
                Explore study{" "}
                <span className="caption-symbol" aria-hidden="true">
                  +
                </span>
              </span>
            </div>
          </a>
        </article>
        <article
          className="work-card reveal"
          id="study-campaign"
          data-category="campaign"
        >
          <a
            className="artwork-button"
            href="/work/visual-language-study/#campaign"
            data-study="campaign"
            aria-haspopup="dialog"
            aria-label="Explore study: One idea. Four compositions."
          >
            <span className="work-art artwork-frame">
              <img
                src="/assets/campaign-study.svg"
                alt="Four coordinated campaign-style artboards with typographic messages and green geometric forms"
                width="1200"
                height="900"
                loading="lazy"
              />
            </span>
            <div className="work-caption">
              <div>
                <p className="eyebrow">Social &amp; campaign · Layout study</p>
                <h3>One idea. Four compositions.</h3>
              </div>
              <span className="card-action">
                Explore study{" "}
                <span className="caption-symbol" aria-hidden="true">
                  +
                </span>
              </span>
            </div>
          </a>
        </article>
        <article
          className="work-card reveal"
          id="study-apparel"
          data-category="apparel"
        >
          <a
            className="artwork-button"
            href="/work/visual-language-study/#apparel"
            data-study="apparel"
            aria-haspopup="dialog"
            aria-label="Explore study: Ideas you can wear."
          >
            <span className="work-art artwork-frame">
              <img
                src="/assets/apparel-study.svg"
                alt="A flat T-shirt illustration with Ideas take shape lettering, beside the graphic on a light panel"
                width="1200"
                height="900"
                loading="lazy"
              />
            </span>
            <div className="work-caption">
              <div>
                <p className="eyebrow">Apparel graphics · Layout study</p>
                <h3>Ideas you can wear.</h3>
              </div>
              <span className="card-action">
                Explore study{" "}
                <span className="caption-symbol" aria-hidden="true">
                  +
                </span>
              </span>
            </div>
          </a>
        </article>
      </div>
    </section>
  );
}
