import { motion, useScroll, useSpring } from "motion/react";

function splitName(name) {
  const parts = name.split(" ").filter(Boolean);
  return {
    first: parts[0] ?? "",
    rest: parts.slice(1).join(" "),
  };
}

function TechIcon({ name }) {
  switch (name) {
    case "React":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="4.6" fill="currentColor" />
          <ellipse
            cx="24"
            cy="24"
            rx="16.5"
            ry="7.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
          />
          <ellipse
            cx="24"
            cy="24"
            rx="16.5"
            ry="7.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            transform="rotate(60 24 24)"
          />
          <ellipse
            cx="24"
            cy="24"
            rx="16.5"
            ry="7.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            transform="rotate(120 24 24)"
          />
        </svg>
      );
    case "Astro":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M24 8L31.5 28.8L24 24.8L16.5 28.8L24 8Z"
            fill="currentColor"
          />
          <path
            d="M18.5 30.6C19.8 35 23 38 27.6 38C31.5 38 34 35.6 34 32.6C34 29.7 32 28.1 28.4 27.1L24.8 26.1L23.5 22.8L20.4 31.7C19.9 33.1 19.1 34.2 18.1 35.2C16.3 33.9 15.2 32.2 15.2 30.2C15.2 27.1 17.6 25 22.1 24.1L21 20.8C14.4 22.2 11.4 25.3 11.4 30.4C11.4 35.4 15.5 39.6 22.6 39.6C30.6 39.6 36.6 35.5 36.6 29.9C36.6 24.8 33.2 22.1 28.2 20.8L24 9.6L18.5 30.6Z"
            fill="currentColor"
          />
        </svg>
      );
    case "Python":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M24.4 8C16.9 8 14 11.3 14 17.1V22H26V24.6H8C8 31.6 11.8 36 18.6 36H22V31.4C22 26.4 26.3 22.8 31.2 22.8H37C41.7 22.8 44 18.9 44 14.6C44 10 40.4 8 35.8 8H24.4ZM20.4 13.2C22 13.2 23.2 14.4 23.2 16C23.2 17.6 22 18.8 20.4 18.8C18.8 18.8 17.6 17.6 17.6 16C17.6 14.4 18.8 13.2 20.4 13.2Z"
            fill="currentColor"
          />
          <path
            d="M23.6 40C31.1 40 34 36.7 34 30.9V26H22V23.4H40C40 16.4 36.2 12 29.4 12H26V16.6C26 21.6 21.7 25.2 16.8 25.2H11C6.3 25.2 4 29.1 4 33.4C4 38 7.6 40 12.2 40H23.6ZM27.6 34.8C29.2 34.8 30.4 33.6 30.4 32C30.4 30.4 29.2 29.2 27.6 29.2C26 29.2 24.8 30.4 24.8 32C24.8 33.6 26 34.8 27.6 34.8Z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      );
    case "Flutter":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M12 30L23.4 18.6H31.5L20.1 30H12ZM20.6 38.2L27 31.8H35.2L28.7 38.2H20.6ZM23.1 30.1L31.5 21.7L39.8 30.1L31.5 38.4L23.1 30.1Z"
            fill="currentColor"
          />
        </svg>
      );
    case "Firebase":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M12 35.6L19 10.5C19.3 9.4 20.7 9.1 21.4 10L25.7 15.5L12 35.6Z"
            fill="currentColor"
            opacity="0.72"
          />
          <path
            d="M12 35.6L31.2 10.2C31.9 9.3 33.3 9.7 33.5 10.8L36 26.2L12 35.6Z"
            fill="currentColor"
            opacity="0.9"
          />
          <path
            d="M12 35.6L26 18.5L36 26.2L24.4 38.4C23.5 39.4 21.8 39.1 21.2 37.8L12 35.6Z"
            fill="currentColor"
          />
        </svg>
      );
    case "MySQL":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M13 18C13 14.1 17.9 11 24 11C30.1 11 35 14.1 35 18V30C35 33.9 30.1 37 24 37C17.9 37 13 33.9 13 30V18Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
          />
          <path
            d="M13 18C13 21.9 17.9 25 24 25C30.1 25 35 21.9 35 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
          />
          <path
            d="M13 24C13 27.9 17.9 31 24 31C30.1 31 35 27.9 35 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect
            x="10"
            y="10"
            width="28"
            height="28"
            rx="10"
            fill="currentColor"
            opacity="0.92"
          />
        </svg>
      );
  }
}

function iconTone(name) {
  switch (name) {
    case "React":
    case "Astro":
      return "cyan";
    case "Python":
      return "blue";
    case "Flutter":
      return "violet";
    case "Firebase":
      return "emerald";
    case "MySQL":
      return "slate";
    default:
      return "cyan";
  }
}

export default function Hero({ site }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 22,
    mass: 0.22,
  });
  const { first, rest } = splitName(site.name || "Portfolio");

  return (
    <>
      <motion.div className="progress-bar" style={{ scaleX }} />

      <section className="hero">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="hero-glow hero-glow-3" />

        <div className="container hero-grid">
          <div className="hero-copy">
            <motion.span
              className="hero-pill"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42 }}
            >
              {site.heroBadge}
            </motion.span>

            <motion.h1
              className="hero-name"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.04 }}
            >
              <span>{first}</span>
              {rest && <span className="hero-name-accent">{rest}</span>}
            </motion.h1>

            <motion.p
              className="hero-role"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {site.role}
            </motion.p>

            <motion.p
              className="hero-lede"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14 }}
            >
              {site.intro}
            </motion.p>

            <motion.p
              className="hero-summary"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
            >
              {site.heroSummary}
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
            >
              <motion.a
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                href="#projects"
                className="btn btn-primary"
              >
                View Projects
              </motion.a>

              <motion.a
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                href="#contact"
                className="btn btn-secondary"
              >
                Contact Me
              </motion.a>

              <motion.a
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                href={site.resumeUrl}
                className="btn btn-ghost"
              >
                {site.resumeLabel}
              </motion.a>
            </motion.div>

            <motion.ul
              className="hero-facts"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {(site.quickFacts ?? []).map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </motion.ul>

            <motion.div
              className="hero-stats"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.34 }}
            >
              {(site.stats ?? []).map((stat) => (
                <div key={stat.label} className="stat-card">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.96, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12 }}
          >
            <motion.div
              className="glass-panel portrait-card"
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
            >
              <div className="portrait-topline">
                <span className="status-dot" />
                <p>{site.availability}</p>
              </div>

              <div className="portrait-frame">
                <div className="portrait-ring portrait-ring-one" />
                <div className="portrait-ring portrait-ring-two" />
                <img
                  src={site.portrait?.src}
                  alt={site.portrait?.alt}
                  className="portrait-image"
                  loading="eager"
                  decoding="async"
                />
              </div>

              <div className="orbit-badges" aria-hidden="true">
                {(site.orbitStack ?? []).map((item, index) => (
                  <span
                    key={item}
                    className={`orbit-chip orbit-chip-${index + 1} orbit-chip-tone-${iconTone(item)}`}
                    title={item}
                  >
                    <span className="orbit-chip-icon" aria-hidden="true">
                      <TechIcon name={item} />
                    </span>
                  </span>
                ))}
              </div>

              <div className="portrait-copy">
                <h2>{site.name}</h2>
                <p>{site.heroSummary}</p>
              </div>

              <div className="hero-focus-tags">
                {(site.focusAreas ?? []).map((area) => (
                  <span key={area}>{area}</span>
                ))}
              </div>

              <div className="hero-mini-grid">
                <div className="hero-mini-card">
                  <span>Current</span>
                  <strong>Vintazk Outsourcing Intern</strong>
                </div>

                <div className="hero-mini-card">
                  <span>School</span>
                  <strong>Western Mindanao State University</strong>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
