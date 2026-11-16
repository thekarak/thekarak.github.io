"use client";

import { useEffect, useState, type ReactNode } from "react";
import { projects, type ProjectCategory } from "@/data/projects";

/** Content stays server rendered; this island only changes which rows are visible. */
export function ProjectFilter({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<ProjectCategory | "All">("All");
  useEffect(() => {
    let frame = 0;
    const reveal = (hash: string) => {
      if (!hash.startsWith("#project-")) return;
      setFilter("All");
      frame = requestAnimationFrame(() =>
        document
          .getElementById(hash.slice(1))
          ?.scrollIntoView({ block: "start" }),
      );
    };
    const onHash = () => reveal(location.hash);
    const onClick = (event: MouseEvent) => {
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>('a[href^="#project-"]')
          : null;
      if (link) reveal(link.hash);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", onHash);
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
    };
  }, []);
  const count = projects.filter(
    (project) => filter === "All" || project.category === filter,
  ).length;
  return (
    <div className="project-index" data-filter={filter}>
      <div
        className="project-filters"
        role="group"
        aria-label="Filter projects"
      >
        {(["All", "Agents & LLMs", "Applied ML", "Tools"] as const).map(
          (category) => (
            <button
              key={category}
              type="button"
              aria-pressed={filter === category}
              aria-controls="project-list"
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ),
        )}
        <span aria-live="polite" className="project-count">
          {count}
          <span className="sr-only"> projects shown</span>
        </span>
      </div>
      <div id="project-list">{children}</div>
    </div>
  );
}
