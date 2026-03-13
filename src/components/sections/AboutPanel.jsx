import { motion } from "motion/react";

export default function AboutPanel({ site }) {
  return (
    <>
      <div className="about-layout">
        <motion.article
          className="glass-panel about-story"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.48 }}
        >
          <span className="panel-label">About Me</span>
          <h3>A closer look at how I build and where I'm headed.</h3>
          <p>{site.about}</p>

          <div className="about-divider" />

          <ul className="check-list">
            {(site.valuePoints ?? []).map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </motion.article>

        <motion.article
          className="glass-panel journey-card"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.06 }}
        >
          <span className="panel-label">Current Journey</span>

          <div className="journey-list">
            {(site.journey ?? []).map((item, index) => (
              <div key={item.title} className="journey-item">
                <span className="journey-count">0{index + 1}</span>
                <div>
                  <small>{item.label}</small>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.article>
      </div>

      <div className="about-card-grid">
        {(site.aboutCards ?? []).map((card, index) => (
          <motion.article
            key={card.title}
            className="glass-panel about-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.12 + index * 0.06 }}
            whileHover={{ y: -6 }}
          >
            <span className="card-index">0{index + 1}</span>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </motion.article>
        ))}
      </div>
    </>
  );
}
