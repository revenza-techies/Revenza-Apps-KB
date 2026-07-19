import React from "react";
import Layout from "@theme/Layout";

import Hero from "../components/Home/Hero";
import FeaturedApps from "../components/Home/FeaturedApps";
import SupportSection from "../components/Home/SupportSection";
import styles from "./index.module.css";

const leaves = Array.from({ length: 10 }, (_, index) => index);

export default function Home() {
  return (
    <Layout
      title="Revenza Knowledge Base"
      description="Official Revenza Apps help center for Shopify merchants. Find Revenza Upsell setup, integration, billing, customization, and troubleshooting guides."
    >
      <main className={styles.homeMain}>
        <div className={styles.natureBackdrop} aria-hidden="true">
          {leaves.map((leaf) => (
            <span key={leaf} className={styles.leaf} />
          ))}
        </div>
        <div className={styles.homeContent}>
          <div className={styles.introShell}>
            <Hero />
            <FeaturedApps />
          </div>
          <SupportSection />
        </div>
      </main>
    </Layout>
  );
}
