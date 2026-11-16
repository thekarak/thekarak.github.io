"use client";

import { useEffect, useState } from "react";

// Flat list for CSS to lay out into 3-4 short monospace rows (e.g. a 3-col grid).
const GLYPHS = [
  "o──o", "*", "+",
  "@", "\\ /", ".",
  "+", "o──o", "@",
  ".", "*", "\\ /",
];

export function BootScreen() {
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let alreadyBooted = false;
    try {
      alreadyBooted = window.sessionStorage.getItem("sk-booted") === "1";
    } catch {
      // Storage can be blocked; treat that as a first visit.
    }

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || alreadyBooted) {
      setDone(true);
      return;
    }

    const leaveTimer = window.setTimeout(() => setLeaving(true), 1500);
    const doneTimer = window.setTimeout(() => {
      setDone(true);
      try {
        window.sessionStorage.setItem("sk-booted", "1");
      } catch {
        // Ignore storage failures; the overlay still dismisses.
      }
    }, 1950);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (done) return null;

  return (
    <div className={`boot${leaving ? " is-leaving" : ""}`} aria-hidden="true">
      <p className="boot-eyebrow">loading evidence trail</p>
      <h1 className="boot-name" data-text="Sourasis Karak">Sourasis Karak</h1>
      <p className="boot-sub">neural net · warming up · 9 layers</p>
      <div className="boot-glyphs" aria-hidden="true">
        {GLYPHS.map((glyph, index) => (
          <span key={index}>{glyph}</span>
        ))}
      </div>
      <span className="boot-bar" />
    </div>
  );
}

export default BootScreen;
