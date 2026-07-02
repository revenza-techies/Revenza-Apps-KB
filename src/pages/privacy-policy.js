import React from 'react';
import Layout from '@theme/Layout';
import styles from './privacy-policy.module.css';

const privacyPolicyHtml = String.raw`<section class="hero">
    <span class="kicker">Privacy First</span>
    <h1>Privacy Policy</h1>
    <p>
      This policy explains what information Revenza collects, why we collect it, and
      how we keep it secure when you use our website and services.
    </p>
    <p class="last-updated"><strong>Last updated:</strong> April 14, 2026</p>
  </section>

  <div class="layout">
    <aside class="toc" aria-label="Privacy quick links">
      <h2>Quick Links</h2>
      <a href="#information-we-collect">1. Information We Collect</a>
      <a href="#how-we-use-information">2. How We Use Information</a>
      <a href="#data-sharing">3. Data Sharing</a>
      <a href="#data-security">4. Data Security</a>
      <a href="#your-rights">5. Your Rights</a>
      <a href="#contact">6. Contact</a>
    </aside>

    <article class="policy">
      <section id="information-we-collect">
        <h2>1. Information We Collect</h2>
        <ul>
          <li>Basic contact details such as name and email.</li>
          <li>Usage data such as pages visited and feature interactions.</li>
          <li>Technical data such as browser type and device information.</li>
        </ul>
      </section>

      <section id="how-we-use-information">
        <h2>2. How We Use Information</h2>
        <ul>
          <li>To operate and improve our services.</li>
          <li>To respond to support requests.</li>
          <li>To maintain security and prevent misuse.</li>
        </ul>
      </section>

      <section id="data-sharing">
        <h2>3. Data Sharing</h2>
        <p>
          We do not sell personal information. We may share limited data when required
          by law or with trusted service providers that help us run our services.
        </p>
      </section>

      <section id="data-security">
        <h2>4. Data Security</h2>
        <p>
          We use reasonable administrative and technical safeguards to protect your
          information from unauthorized access, disclosure, and misuse.
        </p>
      </section>

      <section id="your-rights">
        <h2>5. Your Rights</h2>
        <p>
          You may request access, correction, or deletion of your personal data by
          contacting us.
        </p>
      </section>

      <section id="contact">
        <h2>6. Contact</h2>
        <p>If you have privacy-related questions, contact us at:</p>
        <p class="contact-chip">revenzatechies@gmail.com</p>
      </section>
    </article>
  </div>`;

export default function PrivacyPolicy() {
  return (
    <Layout
      title="Privacy Policy"
      description="Privacy Policy for Revenza apps, website, and services."
    >
      <main className={styles.page}>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{__html: privacyPolicyHtml}}
        />
      </main>
    </Layout>
  );
}