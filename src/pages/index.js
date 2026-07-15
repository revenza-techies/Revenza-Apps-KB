import React from "react";
import Layout from "@theme/Layout";

import Hero from "../components/Hero";
import FeaturedApp from "../components/FeaturedApp";

export default function Home() {
  return (
    <Layout
      title="Revenza Knowledge Base"
      description="Everything you need to get the most from Revenza apps"
    >
      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        <Hero />
        <FeaturedApp />
      </main>
    </Layout>
  );
}