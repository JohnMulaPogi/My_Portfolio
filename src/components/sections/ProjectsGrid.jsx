import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

function accentClass(accent) {
  return `accent-${accent}`;
}

export default function ProjectsGrid({ projects }) {
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    if (!activeProject) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveProject(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeProject]);

  return (
    <>
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

              <motion.button
                type="button"
                whileHover={{ x: 4 }}
                className="project-link"
                onClick={() => setActiveProject(project)}
              >
                {project.linkLabel}
              </motion.button>
            </div>
          </motion.article>
        ))}
      </div>

      <AnimatePresence>
        {activeProject ? (
          <motion.div
            className="project-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProject(null)}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              aria-describedby="project-modal-description"
              className={`glass-panel project-modal ${accentClass(activeProject.accent)}`}
              initial={{ opacity: 0, y: 22, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="project-modal-header">
                <div className="project-modal-heading">
                  <span className="panel-label">Project details</span>
                  <h3 id="project-modal-title">{activeProject.title}</h3>
                  <p id="project-modal-description">
                    This project entry is still being prepared. Full details, visuals,
                    and a proper case study will be added soon.
                  </p>
                </div>

                <button
                  type="button"
                  className="project-modal-close"
                  onClick={() => setActiveProject(null)}
                  aria-label={`Close ${activeProject.title} details`}
                >
                  <span aria-hidden="true">x</span>
                </button>
              </div>

              <div className="project-modal-body">
                <div className="project-modal-topline">
                  <span>{activeProject.status}</span>
                  <span>{activeProject.category}</span>
                  <span>{activeProject.year}</span>
                </div>

                <p className="project-modal-summary">
                  The owner has not added the full project details yet. A clearer
                  breakdown, screenshots, and more complete information will be posted
                  soon.
                </p>

                <div className="project-modal-stack">
                  {activeProject.stack.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
