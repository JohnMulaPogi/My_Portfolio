import { motion } from "motion/react";

export default function SkillsPanel({ skillGroups, workflowSteps }) {
  return (
    <div className="skills-layout">
      <div className="skill-groups">
        {skillGroups.map((group, index) => (
          <motion.article
            key={group.title}
            className={`glass-panel skill-group-card tone-${group.tone}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.42, delay: index * 0.05 }}
            whileHover={{ y: -6 }}
          >
            <div className="skill-group-head">
              <span className={`skill-symbol tone-${group.tone}`}>
                {group.symbol}
              </span>

              <div className="skill-group-copy">
                <h3>{group.title}</h3>
                <p>{group.description}</p>
              </div>
            </div>

            <div className="skill-cluster">
              {group.items.map((item) => (
                <span key={item} className="skill-badge">
                  {item}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>

      <motion.article
        className="glass-panel workflow-panel"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.45 }}
      >
        <div className="workflow-header">
          <span className="panel-label">Workflow</span>
          <h3>My process stays clean, structured, and focused on polish.</h3>
        </div>

        <div className="workflow-grid">
          {workflowSteps.map((step, index) => (
            <motion.article
              key={step.title}
              className="workflow-card"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.42, delay: index * 0.08 }}
            >
              <span className="workflow-step">0{index + 1}</span>
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </motion.article>
          ))}
        </div>
      </motion.article>
    </div>
  );
}
