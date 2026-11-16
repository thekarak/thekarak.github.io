import type { CSSProperties } from "react";

import { skillIcons } from "@/data/skill-icons";
import { site, type Skill } from "@/data/site";

// Two skills have no Simple Icon in skill-icons.ts, so they get a text glyph.
function glyphFor(name: string): string {
  if (name === "JSON prompting") return "{}";
  if (name === "SQL") return "SQL";
  return "•";
}

function SkillIcon({ skill }: { skill: Skill }) {
  const path = skill.icon ? skillIcons[skill.icon] : undefined;

  if (path) {
    return (
      <span className="skill-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d={path} />
        </svg>
      </span>
    );
  }

  return (
    <span className="skill-icon" aria-hidden="true">
      <span className="skill-glyph">{glyphFor(skill.name)}</span>
    </span>
  );
}

export function Skills() {
  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <h2 className="section-title" id="skills-title">Skills</h2>
      <ul className="skill-grid">
        {site.skills.map((skill, index) => (
          <li
            className="skill"
            key={skill.name}
            style={{ "--i": index } as CSSProperties}
          >
            <SkillIcon skill={skill} />
            <span className="skill-name">{skill.name}</span>
            {skill.note ? <span className="skill-note">{skill.note}</span> : null}
          </li>
        ))}
      </ul>
      <div className="care-about">
        <span className="care-label">Things I care about</span>
        <ul className="care-list">
          {site.careAbout.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Skills;
