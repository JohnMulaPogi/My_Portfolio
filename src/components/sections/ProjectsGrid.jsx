import { motion } from "motion/react";

function accentClass(accent) {
  return `accent-${accent}`;
}

export default function ProjectsGrid({ projects }) {
  return (
    <div className="projects-grid">
      {projects.map((project, index) => (
        <motion.article
          key={project.title}
          className={`glass-panel project-card ${accentClass(project.accent)} ${
            project.featured ? "featured" : ""
          }`}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: 0.45, delay: index * 0.06 }}
          whileHover={{ y: -8 }}
        >
          <div className="project-visual">
            <div className="project-browser">
              <span className="project-dot"></span>
              <span className="project-dot"></span>
              <span className="project-dot"></span>
            </div>

            <div className="project-visual-body">
              <div className="project-visual-copy">
                <small>{project.status}</small>
                <strong>{project.title}</strong>
              </div>

              <div className="project-visual-stacks">
                {project.stack.slice(0, 3).map((item) => (
                  <span key={item} className="project-preview-chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="project-visual-lines" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="project-topline">
            <span className="project-index">0{index + 1}</span>
            <div className="project-meta">
              <span>{project.category}</span>
              <span>{project.year}</span>
            </div>
          </div>

          <div className="project-copy">
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
          </div>

          <div className="project-details">
            <div>
              <span className="detail-label">Role</span>
              <p>{project.role}</p>
            </div>

            <div>
              <span className="detail-label">Impact</span>
              <p>{project.outcome}</p>
            </div>
          </div>

          <div className="project-footer">
            <div className="project-stack">
              {project.stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <motion.a
              whileHover={{ x: 4 }}
              href={project.link}
              className="project-link"
              target={project.link.startsWith("http") ? "_blank" : undefined}
              rel={project.link.startsWith("http") ? "noreferrer" : undefined}
            >
              {project.linkLabel}
            </motion.a>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
