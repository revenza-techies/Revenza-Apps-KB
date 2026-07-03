---
id: intro
slug: /overview
title: Welcome to Revenza Upsell
description: Learn how to install Revenza Upsell, create your first offer, customize its storefront appearance, and troubleshoot common issues.
sidebar_label: Welcome
keywords: [Revenza Upsell, Shopify upsell app, Shopify product recommendations]
---

import Link from '@docusaurus/Link';
import {
  ArrowRight,
  CheckCircle,
  Headset,
  PlayCircle,
  ShoppingCartSimple,
  SlidersHorizontal,
  Storefront
} from '@phosphor-icons/react';

<div className="docsEyebrow">Welcome to Revenza Upsell docs</div>

# Grow every order with smarter upsells

Revenza Upsell helps Shopify merchants create relevant product offers that make it easier for customers to discover more items.

<section className="startSection" aria-labelledby="start-here">
  <h2 id="start-here">Start here</h2>
  <p>Follow these steps to launch your first upsell.</p>
  <div className="journey">
    <Link to="/revenza-upsell/getting-started">
      <span>1</span><strong>Install</strong><small>Add Revenza Upsell to your store.</small>
    </Link>
    <Link to="/revenza-upsell/custom-upsell-sets">
      <span>2</span><strong>Create</strong><small>Build your first upsell offer.</small>
    </Link>
    <Link to="/revenza-upsell/mapping">
      <span>3</span><strong>Go live</strong><small>Publish and review your offer.</small>
    </Link>
  </div>
</section>

<div className="docsHomeGrid">
  <section aria-labelledby="popular-guides">
    <h2 id="popular-guides">Popular guides</h2>
    <div className="guideList">
      <Link to="/revenza-upsell/custom-upsell-sets">
        <ShoppingCartSimple size={22}/>
        <span><strong>Create your first upsell</strong><small>Build an offer in a few clear steps.</small></span>
        <ArrowRight size={18}/>
      </Link>
      <Link to="/revenza-upsell/settings">
        <SlidersHorizontal size={22}/>
        <span><strong>Customize the experience</strong><small>Match settings, display behavior, and placement to your store.</small></span>
        <ArrowRight size={18}/>
      </Link>
      <Link to="/revenza-upsell/mapping">
        <Storefront size={22}/>
        <span><strong>Show offers at the right time</strong><small>Choose where and when your upsells appear.</small></span>
        <ArrowRight size={18}/>
      </Link>
      <Link to="/contact">
        <CheckCircle size={22}/>
        <span><strong>Troubleshoot common issues</strong><small>Reach support when setup or display checks need help.</small></span>
        <ArrowRight size={18}/>
      </Link>
    </div>
  </section>
  <section aria-labelledby="video-tutorial">
    <h2 id="video-tutorial">Video tutorial</h2>
    <Link className="videoCard" to="/revenza-upsell/custom-upsell-sets">
      <PlayCircle size={58} weight="fill" />
      <span>
        <strong>Create your first upsell</strong>
        <small>A concise walkthrough from offer setup to storefront preview.</small>
      </span>
    </Link>
  </section>
</div>

<aside className="supportCard">
  <Headset size={28} weight="duotone" />
  <div><strong>Need help?</strong><span>Our merchant support team is here for you.</span></div>
  <a href="mailto:support@revenza.in">Contact support <ArrowRight size={16}/></a>
</aside>