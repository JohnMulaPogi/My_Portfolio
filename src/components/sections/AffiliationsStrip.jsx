import { motion } from "motion/react";

export default function AffiliationsStrip({ affiliations }) {
  return (
    <div className="affiliations-strip">
      {affiliations.map((item, index) => (
        <motion.article
          key={item.name}
          className="glass-panel affiliation-card"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.42, delay: index * 0.08 }}
          whileHover={{ y: -4 }}
        >
          <div className="affiliation-logo-shell">
            <img
              src={item.logo}
              alt={item.alt}
              className="affiliation-logo"
              loading="lazy"
            />
          </div>

          <div className="affiliation-copy">
            <span>{item.label}</span>
            <h3>{item.name}</h3>
            <p>{item.detail}</p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
