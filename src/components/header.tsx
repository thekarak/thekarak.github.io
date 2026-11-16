"use client";

import { useEffect, useState } from "react";

export function Header() {
  const [time, setTime] = useState("--:--");
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const update = () => setTime(format.format(new Date()));
    update();
    const interval = setInterval(update, 10000);
    setDark(document.documentElement.dataset.theme === "dark");
    const media = matchMedia("(prefers-color-scheme: dark)");
    const followSystem = () => {
      let saved = null;
      try {
        saved = localStorage.getItem("sk-theme");
      } catch {
        /* Storage is optional. */
      }
      if (!saved) {
        document.documentElement.dataset.theme = media.matches
          ? "dark"
          : "light";
        setDark(media.matches);
      }
    };
    media.addEventListener("change", followSystem);
    return () => {
      clearInterval(interval);
      media.removeEventListener("change", followSystem);
    };
  }, []);
  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("sk-theme", next ? "dark" : "light");
    } catch {
      /* The current theme still works. */
    }
  }
  return (
    <header id="top" className="site-header">
      <a className="brand" href="#top" aria-label="Sourasis — back to top">
        Sourasis
      </a>
      <nav aria-label="Main navigation">
        <a href="#about">About</a>
        <a href="#work">Work</a>
        <a href="#notes">Notes</a>
        <a href="#contact">Contact</a>
      </nav>
      <div className="header-tools">
        <span className="local-time">
          <time aria-label={`Kolkata time ${time}`}>{time}</time> IST
        </span>
        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
          aria-pressed={dark}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          >
            <circle cx="10" cy="10" r="6.5" />
            <path d="M10 3.5a6.5 6.5 0 0 1 0 13Z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </header>
  );
}
