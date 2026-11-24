import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ExperienceRuntime from "@/components/ExperienceRuntime";
import TypeLab from "@/components/TypeLab";
import {
  Hero,
  DisciplineStrip,
  Expertise,
  About,
  Process,
  Contact,
} from "@/components/PortfolioSections";
import { WorkGallery } from "@/components/WorkGallery";
import { profile } from "@/content/profile";
import { siteOrigin } from "@/lib/indexing";
import "@/styles/home.css";

export default function HomePage() {
  const origin = siteOrigin();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${origin}/#profile`,
    url: `${origin}/`,
    name: profile.title,
    mainEntity: {
      "@type": "Person",
      "@id": `${origin}/#person`,
      name: profile.name,
      url: `${origin}/`,
      jobTitle: profile.role,
      description: "Graphic designer based in Bangladesh.",
      image: `${origin}${profile.portrait}`,
      sameAs: [profile.behance],
    },
  };
  return (
    <div className="home-page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <DisciplineStrip />
        <WorkGallery />
        <Expertise />
        <TypeLab />
        <About />
        <Process />
        <Contact />
      </main>
      <SiteFooter />
      {/* The progressive viewer owns this empty dialog's descendants. */}
      <dialog
        className="study-dialog"
        data-lenis-prevent=""
        aria-label="Portfolio study"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <ExperienceRuntime />
    </div>
  );
}
