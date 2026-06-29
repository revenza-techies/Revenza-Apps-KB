import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {MagnifyingGlass, Sparkle} from '@phosphor-icons/react';
import AppCard from '../components/AppCard';
import BrandScene from '../components/BrandScene';
import apps from '../data/apps.json';
import homeContent from '../data/homeContent.json';
import styles from './index.module.css';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Revenza Help Center',
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
          </div>
        </section>
        <section className={styles.appsSection} id="apps" aria-labelledby="apps-heading">
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.kicker}>{homeContent.appsKicker}</span>
              <Heading as="h2" id="apps-heading">
                {homeContent.appsHeading}
              </Heading>
            </div>
            <p>{homeContent.appsIntro}</p>
          </div>
          <div className={styles.appGrid}>
            {apps.map((app) => (
              <AppCard app={app} key={app.slug} />
            ))}
          </div>
          <div className={styles.supportStrip}>
            <div>
              <strong>{homeContent.supportHeading}</strong>
              <span>{homeContent.supportText}</span>
            </div>
            <a href={homeContent.supportUrl}>{homeContent.supportCta}</a>
          </div>
        </section>
      </main>
    </Layout>
  );
}