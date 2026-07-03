import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {ArrowRight, BookOpenText, Headset, MagnifyingGlass, Sparkle} from '@phosphor-icons/react';
import AppCard from '../components/AppCard';
import BrandScene from '../components/BrandScene';
import apps from '../data/apps.json';
import homeContent from '../data/homeContent.json';
import styles from './index.module.css';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Revenza Knowledge Base',
  url: 'https://docs.revenza.in/',
  description: homeContent.description,
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
    <Layout title={homeContent.title} description={homeContent.description}>
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      <main>
        <section className={styles.hero}>
          <BrandScene />
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <div className={styles.eyebrow}>
                <Sparkle size={18} weight="fill" aria-hidden="true" />
                {homeContent.eyebrow}
              </div>
              <Heading as="h1">{homeContent.heroHeading}</Heading>
              <p>{homeContent.heroSubheading}</p>
              <a className={styles.searchHint} href="#apps">
                <MagnifyingGlass size={22} aria-hidden="true" />
                <span>{homeContent.primaryAction}</span>
                <kbd>{apps.length} app</kbd>
              </a>
            </div>
            <div className={styles.heroApps} id="apps" aria-label="Revenza app knowledge bases">
              <div className={styles.heroAppsHeader}>
                <span>{homeContent.appsKicker}</span>
                <strong>{apps.length} knowledge base</strong>
              </div>
              <div className={styles.featuredApps}>
                {apps.map((app) => (
                  <AppCard app={app} key={app.slug} featured />
                ))}
              </div>
              <div className={styles.quickLinks} aria-label="Quick support links">
                <a href="/contact">
                  <Headset size={20} weight="duotone" aria-hidden="true" />
                  Contact support
                  <ArrowRight size={16} weight="bold" aria-hidden="true" />
                </a>
                <a href="/revenza-upsell/overview">
                  <BookOpenText size={20} weight="duotone" aria-hidden="true" />
                  Open docs
                  <ArrowRight size={16} weight="bold" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
