/** Small conceptual illustrations of the work, rather than simulated app screenshots. */
export function ProjectSketch({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 160 112" fill="none" aria-hidden="true">
      {id === "bioagent" && (
        <>
          <path className="sketch-guide" d="M16 84V20M16 84h128" />
          {Array.from({ length: 42 }, (_, i) => {
            const angle = i * 2.4;
            const radius = 10 + Math.sqrt(i) * 5;
            return (
              <circle
                key={i}
                cx={79 + Math.cos(angle) * radius}
                cy={54 + Math.sin(angle) * radius * 0.68}
                r={i % 4 === 0 ? 3 : 2}
                className={i % 3 === 0 ? "sketch-ink-fill" : "sketch-dot"}
              />
            );
          })}
          <path className="sketch-ink" d="m112 27 5 5 10-12" />
          <text x="24" y="100">
            spatial → verified
          </text>
        </>
      )}
      {id === "winelens" && (
        <>
          <path className="sketch-guide" d="M24 80V20M24 80h112" />
          {Array.from({ length: 22 }, (_, i) => (
            <circle
              key={i}
              cx={33 + i * 4.4}
              cy={73 - i * 2 + (i % 4) * 7}
              r="2"
              className={i % 3 === 0 ? "sketch-ink-fill" : "sketch-dot"}
            />
          ))}
          <path className="sketch-ink" d="M30 74q52-13 103-51" />
          <text x="24" y="100">
            measure → estimate
          </text>
        </>
      )}
      {id === "truthscope" && (
        <>
          <rect
            x="20"
            y="22"
            width="46"
            height="62"
            rx="2"
            className="sketch-guide"
          />
          <path
            className="sketch-guide"
            d="M29 35h27M29 44h22M29 53h27M29 62h17"
          />
          <path className="sketch-ink" d="M69 53h17m-4-4 4 4-4 4" />
          {[30, 51, 72].map((y, i) => (
            <g key={y}>
              <rect
                x="96"
                y={y}
                width="11"
                height="11"
                rx="1"
                className="sketch-guide"
              />
              <path
                className={i === 1 ? "sketch-guide" : "sketch-ink"}
                d={`m98 ${y + 5} 3 3 4-6`}
              />
              <path className="sketch-guide" d={`M114 ${y + 5}h22`} />
            </g>
          ))}
          <text x="20" y="100">
            claims ↔ sources
          </text>
        </>
      )}
      {id === "tokenlab" && (
        <>
          <text x="20" y="30" className="sketch-code">
            How models read.
          </text>
          <path className="sketch-guide" d="M20 41h120" />
          {[21, 52, 83, 114].map((x, i) => (
            <g key={x}>
              <rect
                x={x}
                y="52"
                width="24"
                height="23"
                rx="2"
                className={i === 2 ? "sketch-token-active" : "sketch-guide"}
              />
              <text x={x + 7} y="67" className="sketch-code">
                {["H", "m", "r", "."][i]}
              </text>
            </g>
          ))}
          <text x="20" y="100">
            text → tokens → ids
          </text>
        </>
      )}
      {id === "varuna" && (
        <>
          <path
            className="sketch-guide"
            d="M20 34c18-18 34 17 53 0s34 17 66 0M20 49c18-18 34 17 53 0s34 17 66 0M20 64c18-18 34 17 53 0s34 17 66 0M20 79c18-18 34 17 53 0s34 17 66 0"
          />
          <ellipse cx="92" cy="54" rx="24" ry="14" className="sketch-ink" />
          <path className="sketch-ink" d="M92 33v9m0 24v9M61 54h10m42 0h10" />
          <text x="20" y="100">
            radar → insight
          </text>
        </>
      )}
      {id === "roastme" && (
        <>
          <path
            className="sketch-guide"
            d="M29 21h73l26 23v42H29ZM102 21v23h26M40 34h31M40 46h45"
          />
          <text x="41" y="67" className="sketch-code">
            {"{ feedback }"}
          </text>
          <path className="sketch-ink" d="m112 71 4 4 9-11" />
          <text x="29" y="100">
            review → reflect
          </text>
        </>
      )}
    </svg>
  );
}
