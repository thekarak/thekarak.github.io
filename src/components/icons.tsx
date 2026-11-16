export function Arrow({
  down = false,
  className = "",
}: {
  down?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={`arrow ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d={down ? "M12 4v16m-6-6 6 6 6-6" : "M5 19 19 5M5 5h14v14"} />
    </svg>
  );
}

export function ProjectGlyph({ id }: { id: string }) {
  const paths: Record<string, string> = {
    winelens: "M8 38V8M8 38h32M12 31l8-5 8-12 11-5M12 21h.1M23 33h.1M33 22h.1",
    truthscope: "M12 5h20l6 6v32H12ZM30 5v9h8M18 21h13M18 27h8M22 34l4 4 13-14",
    tokenlab: "m16 12-12 12 12 12m16-24 12 12-12 12M28 6l-8 36",
    varuna:
      "M3 16q7-10 14 0t14 0 14 0M3 26q7-10 14 0t14 0 14 0M3 36q7-10 14 0t14 0 14 0",
    roastme:
      "M27 4c2 12-12 13-9 24 4-1 6-5 5-9 14 8 13 22 0 24C3 43 4 23 13 18c-1 7 1 9 3 9C12 15 24 13 27 4Z",
  };
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[id] || paths.truthscope} />
    </svg>
  );
}
