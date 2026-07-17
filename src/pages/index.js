import React from "react";
import Layout from "@theme/Layout";

import Hero from "../components/Home/Hero";
import FeaturedApps from "../components/Home/FeaturedApps";
import LatestDocumentation from "../components/Home/LatestDocumentation";
import SupportSection from "../components/Home/SupportSection";
import CTA from "../components/Home/CTA";

export default function Home() {
  return (
    <Layout
      title="Revenza Knowledge Base"
      description="Everything you need to get the most from Revenza apps"
    >
      <main>
        <Hero />
        <FeaturedApps />
        <LatestDocumentation />
        <SupportSection />
        <CTA />
      </main>
    </Layout>
  );
}