import Link from "next/link";
import { site } from "@/data/site";
import { SiteHeader } from "@/components/site-header";
import { HeroLinks } from "@/components/hero-links";
import { AsciiBackground } from "@/components/ascii-background";
import { Skills } from "@/components/skills";

function lines(value: string | string[]): string[] {
  return Array.isArray(value) ? value : [value];
}

export default function Home() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || site.siteUrl;
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: base,
    email: `mailto:${site.email}`,
    sameAs: [site.github],
    image: `${base}${site.avatar}`,
    jobTitle: "Computer Science Undergraduate",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kolkata",
      addressCountry: "IN",
    },
    knowsAbout: ["Machine Learning", "Scientific Agents", "Evaluation Tooling"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(person).replace(/</g, "\\u003c"),
        }}
      />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="page">
        <SiteHeader />
        <main id="main" className="note">
          <section id="about" className="hero">
            <h1>hi, i&apos;m sourasis.</h1>
            {lines(site.lede).map((line) => (
              <p className="hero-lede" key={line}>
                {line}
              </p>
            ))}
            <HeroLinks />
            <p className="blog-note">
              <Link href="/blog">blog</Link> — coming soon
            </p>
            <p className="status">
              <span aria-hidden="true" />
              {site.status}
            </p>
          </section>

          <AsciiBackground />

          <section id="now" className="section">
            <h2 className="section-title">Now</h2>
            {lines(site.now).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          <section id="beliefs" className="section">
            <h2 className="section-title">Things I believe</h2>
            <ul className="bullets">
              {site.beliefs.map((belief) => (
                <li key={belief}>{belief}</li>
              ))}
            </ul>
          </section>

          <section id="likes" className="section">
            <h2 className="section-title">Things I like</h2>
            <p>{site.likes.join(", ")}.</p>
          </section>

          <section id="work" className="section">
            <h2 className="section-title">Selected work</h2>
            <ul className="work">
              {site.work.map((item) => (
                <li className="work-item" key={item.name}>
                  <span className="work-name">
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noreferrer">
                        {item.name} <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      item.name
                    )}
                  </span>
                  <span className="work-note"> — {item.note}</span>
                  {item.year ? (
                    <span className="work-year"> · {item.year}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>

          <Skills />
        </main>
        <footer className="site-footer">
          <span>{site.tagline}</span>
          <a href="#top">back to top ↑</a>
        </footer>
      </div>
    </>
  );
}
