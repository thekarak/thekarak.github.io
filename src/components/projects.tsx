import { pipeline, projects, type Project } from "@/data/projects";

function ProjectRecord({ project }: { project: Project }) {
  return (
    <article id={`project-${project.id}`} className="project-record">
      <h3>
        <a href={project.source} target="_blank" rel="noreferrer">
          {project.name}
        </a>
        {project.demo && (
          <a
            className="demo-link"
            href={project.demo}
            aria-label={`${project.name} live demo`}
            target="_blank"
            rel="noreferrer"
          >
            demo ↗
          </a>
        )}
      </h3>
      <p>{project.description}</p>
      <details className="project-details">
        <summary>How it works</summary>
        <div className="method-copy">
          <p>{project.method}</p>
          {project.featured && (
            <ol className="evidence-sequence" aria-label="BioAgent-ST workflow">
              {pipeline.map((step) => (
                <li key={step.number}>{step.title}</li>
              ))}
            </ol>
          )}
          <p className="project-stack">{project.stack.join(" · ")}</p>
          {project.limitation && (
            <p>
              <strong>In context.</strong> {project.limitation}
            </p>
          )}
        </div>
      </details>
    </article>
  );
}
export function Projects() {
  return (
    <div className="project-list">
      {projects.map((project) => (
        <ProjectRecord key={project.id} project={project} />
      ))}
    </div>
  );
}
