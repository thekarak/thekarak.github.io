"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/data/site";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  // Render a neutral placeholder on the server, then fill in local time.
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date());

    setTime(format());
    const id = setInterval(() => setTime(format()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header id="top" className="site-header">
      <Link className="brand" href="/#top">
        {site.name}
      </Link>
      <nav className="nav" aria-label="Sections">
        <Link href="/#about">about</Link>
        <Link href="/#work">work</Link>
        <Link href="/blog">blog</Link>
      </nav>
      <div className="header-actions">
        <span className="clock" suppressHydrationWarning>
          Kolkata · {time ?? "--:--"}
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}
