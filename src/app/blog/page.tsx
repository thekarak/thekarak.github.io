import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Blog — Sourasis Karak",
};

export default function BlogPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="page">
        <SiteHeader />
        <main id="main" className="note">
          <section className="hero">
            <h1>blog</h1>
            <p className="hero-lede">coming soon.</p>
          </section>
          <section className="section">
            <h2 className="section-title">notes</h2>
            <p>notes are being written — check back in a bit.</p>
            <p className="blog-note">
              <Link href="/">← back home</Link>
            </p>
          </section>
        </main>
        <footer className="site-footer">
          <span>{site.tagline}</span>
          <a href="#top">back to top ↑</a>
        </footer>
      </div>
    </>
  );
}
