import { motion } from "motion/react";

export default function ContactPanel({ site }) {
  return (
    <div className="contact-grid">
      <motion.div
        className="glass-panel contact-card"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45 }}
      >
        <span className="panel-label">Contact Details</span>
        <h3>Let's build something useful and well-crafted.</h3>
        <p>{site.contactBlurb}</p>

        <div className="contact-methods">
          <a className="contact-method" href={`mailto:${site.email}`}>
            <span>Email</span>
            <strong>{site.email}</strong>
          </a>

          {site.phone && (
            <a
              className="contact-method"
              href={`tel:${site.phone.replace(/\s+/g, "")}`}
            >
              <span>Phone</span>
              <strong>{site.phone}</strong>
            </a>
          )}

          <div className="contact-method">
            <span>Location</span>
            <strong>{site.location}</strong>
          </div>
        </div>

        <div className="contact-divider" />

        <h4>Reach out for</h4>
        <ul className="check-list">
          {(site.contactTopics ?? []).map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>

        <div className="social-strip social-strip-compact">
          {(site.socialLinks ?? []).map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="social-link"
              target="_blank"
              rel="noreferrer"
            >
              <span>{item.label}</span>
              <small>{item.meta}</small>
            </a>
          ))}
        </div>
      </motion.div>

      <motion.form
        className="glass-panel contact-form"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="form-header">
          <span className="panel-label">Message Me</span>
          <h3>A refined contact form ready for your backend later.</h3>
          <p>
            You can keep this as a portfolio contact UI for now, then connect it
            to EmailJS, Formspree, or your own backend later.
          </p>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" type="text" placeholder="Your name" />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@example.com" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            type="text"
            placeholder="Project inquiry, collaboration, internship, and more"
          />
        </div>

        <div className="field">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            rows="6"
            placeholder="Write your message here..."
          />
        </div>

        <div className="note-card">
          <strong>Quick note</strong>
          <p>
            I also respond through email, LinkedIn, and Facebook if you prefer
            direct contact.
          </p>
        </div>

        <button className="btn btn-primary" type="submit">
          Send Message
        </button>
      </motion.form>
    </div>
  );
}
