"use client";

import { useState } from "react";
import { pipeline, specimenStages } from "@/data/projects";

export function EvidenceFigure() {
  const [active, setActive] = useState(2);
  const stage = pipeline[active];
  // A small, original SVG instrument. The selected stage changes the geometry;
  // it does not run a model or imply a live scientific result.
  const traces = Array.from({ length: 21 }, (_, index) => {
    const y = 62 + index * 12;
    const bend =
      active === 0 ? 70 : active === 1 ? 130 : active === 2 ? 190 : 250;
    return `M26 ${y} C115 ${y}, ${bend} ${306 - index * 12}, 225 182 S335 ${y}, 424 ${y}`;
  });
  return (
    <figure className="evidence-figure specimen">
      <div className="figure-meta mono">
        <span>SPECIMEN / 001</span>
        <span>ANATOMY OF A TRUSTED RESULT</span>
      </div>
      <div className="specimen-stage">
        <span className="specimen-margin mono">
          A CONCEPTUAL STUDY · BIOAGENT-ST
        </span>
        <svg
          className="trace-art"
          viewBox="0 0 450 360"
          fill="none"
          role="img"
          aria-labelledby="trace-title"
        >
          <title id="trace-title">{`${stage.title}: a conceptual diagram of a question becoming a traceable scientific result.`}</title>
          <defs>
            <pattern
              id="trace-grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r=".6" fill="currentColor" opacity=".2" />
            </pattern>
          </defs>
          <rect width="450" height="360" fill="url(#trace-grid)" />
          <path
            className="figure-guide"
            d="M18 182H432M225 22V338"
            strokeDasharray="2 6"
          />
          <circle
            cx="225"
            cy="182"
            r="124"
            className="specimen-orbit"
            strokeDasharray="1 9"
          />
          <g className="specimen-traces">
            {traces.map((d, index) => (
              <path key={index} d={d} />
            ))}
          </g>
          <path
            key={active}
            className="specimen-signal"
            d={traces[10]}
            pathLength="1"
          />
          <circle cx="225" cy="182" r="65" className="trace-ring" />
          <circle cx="225" cy="182" r="48" className="trace-ring" />
          <path
            d="M215 114h20m-10-10v20M215 250h20m-10-10v20"
            className="specimen-crosshair"
          />
          <text x="225" y="177" textAnchor="middle" className="specimen-number">
            0{active + 1}
          </text>
          <text x="225" y="198" textAnchor="middle" className="specimen-state">
            {stage.title.toUpperCase()}
          </text>
          <circle cx="26" cy="182" r="3" className="trace-core" />
          <circle cx="424" cy="182" r="3" className="trace-core" />
          <text x="26" y="339" className="diagram-label">
            QUESTION IN
          </text>
          <text x="335" y="339" className="diagram-label">
            EVIDENCE OUT
          </text>
        </svg>
        <span className="specimen-reference mono">SK—ET / {stage.number}</span>
      </div>
      <div
        className="specimen-controls"
        role="group"
        aria-label="Inspect the evidence specimen"
      >
        {pipeline.map((item, index) => (
          <button
            key={item.title}
            aria-pressed={active === index}
            aria-controls="specimen-readout"
            onClick={() => setActive(index)}
          >
            <span className="mono">{item.number}</span>
            {item.title}
          </button>
        ))}
      </div>
      <figcaption
        id="specimen-readout"
        className="specimen-readout"
        aria-live="polite"
      >
        <span className="specimen-caption-number mono">{stage.number} /</span>
        <div>
          <strong>{specimenStages[active]}</strong>
          <p>{stage.description}</p>
        </div>
      </figcaption>
      <a className="specimen-foot mono text-link" href="#project-bioagent">
        INSPECT THE REAL SYSTEM <span aria-hidden="true">↗</span>
      </a>
    </figure>
  );
}
