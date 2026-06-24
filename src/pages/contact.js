import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {EnvelopeSimple, Headset, Timer} from '@phosphor-icons/react';
import ContactForm from '../components/ContactForm';
import styles from './contact.module.css';

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Revenza Support',
  url: 'https://docs.revenza.in/contact',
  mainEntity: {
    '@type': 'Organization',
    name: 'Revenza',
    email: 'support@revenza.in',
    url: 'https://revenza.in',
  },
};

export default function ContactPage() {
  return (
    <Layout
      title="Contact Revenza Support"
      description="Contact the Revenza support team for help with Revenza Shopify apps.">
      <script type="application/ld+json">{JSON.stringify(contactSchema)}</script>
      <main className={styles.page}>
        <section className={styles.intro}>
          <span>Merchant support</span>
          <Heading as="h1">Tell us how we can help</Heading>
          <p>
            Share your app question and store context. We will use it to give you a
            more useful reply.
          </p>
        </section>
        <div className={styles.layout}>
          <ContactForm />
          <aside className={styles.details}>
            <div className={styles.detail}>
              <EnvelopeSimple size={26} weight="duotone" />
              <div>
                <h2>Prefer email?</h2>
                <a href="mailto:support@revenza.in">support@revenza.in</a>
              </div>
            </div>
            <div className={styles.detail}>
              <Headset size={26} weight="duotone" />
              <div>
                <h2>Useful details</h2>
                <p>
                  Include the app name, store URL, affected product, and a screenshot
                  when possible.
                </p>
              </div>
            </div>
            <div className={styles.detail}>
              <Timer size={26} weight="duotone" />
              <div>
                <h2>Response time</h2>
                <p>We will reply as soon as a support specialist is available.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
