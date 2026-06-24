import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {MagnifyingGlass, Sparkle} from '@phosphor-icons/react';
import AppCard from '../components/AppCard';
import BrandScene from '../components/BrandScene';
import {apps} from '../data/apps';
import styles from './index.module.css';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Revenza Help Center',
  url: 'https://docs.revenza.in/',
  description: 'Guides, tutorials, FAQs, and troubleshooting for Revenza Shopify apps.',
  hasPart: apps.map((app) => ({
    '@type': 'SoftwareApplication',
    name: app.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Shopify',
    url: `https://docs.revenza.in${app.href}`,
  })),
};

export default function Home() {
  return (
    <Layout title="Shopify App Help Center" description="Browse guides, tutorials, FAQs, and troubleshooting for every Revenza Shopify app.">
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      <main>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <div className={styles.eyebrow}>
                <Sparkle size={18} weight="fill" aria-hidden="true" />
                Revenza Help Center
              </div>
              <Heading as="h1">How can we help your store grow?</Heading>
              <p>Choose your Revenza app to find practical setup guides, tutorials, answers, and troubleshooting steps.</p>
              <a className={styles.searchHint} href="#apps">
                <MagnifyingGlass size={22} aria-hidden="true" />
                <span>Browse all app knowledge bases</span>
                <kbd>{apps.length} app</kbd>
              </a>
            </div>
            <BrandScene />
          </div>
        </section>

        <section className={styles.appsSection} id="apps" aria-labelledby="apps-heading">
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.kicker}>Our apps</span>
              <Heading as="h2" id="apps-heading">Find the right knowledge base</Heading>
            </div>
            <p>Each app has its own focused guides, so you can move from question to answer without digging.</p>
          </div>
          <div className={styles.appGrid}>
            {apps.map((app) => <AppCard app={app} key={app.slug} />)}
          </div>
          <div className={styles.supportStrip}>
            <div>
              <strong>Still not sure where to look?</strong>
              <span>Tell us what you are trying to do and our merchant support team will point you in the right direction.</span>
            </div>
            <a href="/contact">Contact support</a>
          </div>
        </section>
      </main>
    </Layout>
  );
}
