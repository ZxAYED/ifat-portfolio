import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ExperienceRuntime from "@/components/ExperienceRuntime";
import { StudyContent } from "@/components/StudyContent";
import "@/styles/case-study.css";

const slug = "visual-language-study";
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ slug }];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  if ((await params).slug !== slug) notFound();
  return {
    title: { absolute: "The ifat. visual study — Ifat portfolio concept" },
    description:
      "Four connected website layout studies exploring identity, labels, apparel, and campaign compositions. Concept artwork created by ChatGPT for the Ifat portfolio website.",
    alternates: { canonical: `/work/${slug}/` },
    openGraph: {
      title: "The ifat. visual study — Ifat portfolio concept",
      description:
        "One visual language, four illustrative applications. Concept artwork created by ChatGPT for this website.",
      url: `/work/${slug}/`,
      images: [{ url: "/assets/ifat-social.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "The ifat. visual study — Ifat portfolio concept",
      description: "One visual language, four illustrative applications.",
      images: ["/assets/ifat-social.png"],
    },
  };
}

export default async function StudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if ((await params).slug !== slug) notFound();
  return (
    <div className="study-page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader home={false} />
      <StudyContent />
      <SiteFooter home={false} />
      <ExperienceRuntime />
    </div>
  );
}
