"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/projects";

export function CopyEmail() {
  const [message, setMessage] = useState("Copy email");
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setMessage("Copied");
    } catch {
      setMessage("Use the email link to get in touch");
    }
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setMessage("Copy email"), 3000);
  }
  return (
    <button className="copy-email mono" onClick={copy}>
      <svg
        width="15"
        height="15"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
      >
        <rect x="7" y="7" width="10" height="10" rx="1" />
        <path d="M12 7V3H3v9h4" />
      </svg>
      <span aria-live="polite">{message}</span>
    </button>
  );
}
