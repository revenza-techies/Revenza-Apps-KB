---
draft: true
---

# Revenza Brand, Contact, and Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add branded 3D motion assets, a compact vertical Revenza Upsell app card, and a production-ready Web3Forms contact page while preserving the existing responsive Docusaurus knowledge-base experience.

**Architecture:** Keep the Docusaurus site static for GitHub Pages. Generate three raster assets from the supplied brand references, animate them with GPU-friendly CSS transforms, and disable motion under `prefers-reduced-motion`. Implement the contact form as a focused React component that submits to Web3Forms using a build-time `WEB3FORMS_ACCESS_KEY` supplied through GitHub Actions secrets.

**Tech Stack:** Docusaurus 3.10, React 19, CSS Modules, Phosphor Icons, Web3Forms REST API, built-in ImageGen, Node test runner, GitHub Actions, GitHub Pages.

---

## Design Brief

- Preserve the existing plum, lavender, apricot, and cream visual system.
- Use the supplied Revenza corporate logo as the identity source for the navbar and homepage brand object.
- Use the supplied Revenza Upsell logo as the identity source for the app card.
- Make the hero visually richer with a generated 3D ecommerce background, but keep text contrast, page speed, and documentation discoverability ahead of decoration.
- Make the app card vertical, compact, image-led, and suitable for a future multi-app grid.
- Keep all animation subtle, purposeful, responsive, and disabled for users who prefer reduced motion.
- Add `/contact` with Web3Forms submission, useful validation, status feedback, direct-email fallback, canonical metadata, and ContactPage structured data.
- Update all GitHub links and deployment metadata to `revenza-techies/Revenza-Apps-KB`.

## File Structure

### Create

- `static/img/brand/revenza-brand-3d.webp` - transparent or clean-edged 3D brand mark derived from the supplied Revenza logo.
- `static/img/brand/revenza-upsell-3d.webp` - compact 3D app artwork derived from the supplied Upsell logo.
- `static/img/brand/revenza-hero-3d.webp` - wide ecommerce-themed 3D hero background with safe negative space for copy.
- `static/img/brand/revenza-logo-source.png` - optimized archival copy of the supplied corporate logo.
- `static/img/apps/revenza-upsell-source.png` - optimized archival copy of the supplied app logo.
- `src/components/BrandScene/index.js` - semantic wrapper for the floating brand object and decorative hero artwork.
- `src/components/BrandScene/styles.module.css` - responsive scene layout and reduced-motion-safe animation.
- `src/components/ContactForm/index.js` - Web3Forms state, validation, payload, submission, and accessible feedback.
- `src/components/ContactForm/styles.module.css` - contact form controls, status states, and responsive layout.
- `src/utils/contactForm.js` - pure validation and Web3Forms payload helpers.
- `src/utils/contactForm.test.js` - Node tests for validation and payload construction.
- `src/pages/contact.js` - SEO-ready contact page and ContactPage JSON-LD.
- `src/pages/contact.module.css` - contact page layout and support information panel.
- `.env.example` - documents the required local Web3Forms key.

### Modify

- `package.json` - add the Node test command.
- `docusaurus.config.js` - update repository identity, expose the Web3Forms key, replace the navbar logo, and add Contact navigation.
- `src/data/apps.js` - add the generated Upsell artwork path and concise app-card copy.
- `src/components/AppCard/index.js` - replace initials with the generated app artwork.
- `src/components/AppCard/styles.module.css` - create a compact vertical card with minimal unused space.
- `src/pages/index.js` - add `BrandScene`, keep the app directory flow, and strengthen homepage structured data.
- `src/pages/index.module.css` - convert the hero to a balanced copy-and-3D composition across breakpoints.
- `src/css/custom.css` - update brand tokens from the supplied corporate logo and navbar image sizing.
- `.github/workflows/deploy.yml` - pass the Web3Forms key from GitHub Actions secrets into the build.
- `.gitignore` - keep local `.env` files private.
- `README.md` - document asset sources, Web3Forms setup, contact testing, GitHub Pages, and custom-domain setup.

## Task 1: Initialize Git and Connect the Approved Repository

**Files:**
- Modify: local Git metadata only
- Verify: `docusaurus.config.js`

- [ ] **Step 1: Confirm the workspace is not already a repository**

Run:

```powershell
git status --short
```

Expected: `fatal: not a git repository`.

- [ ] **Step 2: Initialize the repository on `main`**

Run:

```powershell
git init -b main
git remote add origin https://github.com/revenza-techies/Revenza-Apps-KB.git
git remote -v
```

Expected: both fetch and push URLs point to `revenza-techies/Revenza-Apps-KB.git`.

- [ ] **Step 3: Update the documentation repository identity**

Change `docusaurus.config.js`:

```js
const repositoryUrl = 'https://github.com/revenza-techies/Revenza-Apps-KB';

const config = {
  organizationName: 'revenza-techies',
  projectName: 'Revenza-Apps-KB',
  // existing configuration
};
```

- [ ] **Step 4: Verify configuration syntax**

Run:

```powershell
node --check docusaurus.config.js
```

Expected: exit code `0`.

- [ ] **Step 5: Commit repository configuration**

```powershell
git add docusaurus.config.js
git commit -m "chore: connect knowledge base repository"
```

## Task 2: Generate and Prepare the 3D Brand Assets

**Files:**
- Create: `static/img/brand/revenza-brand-3d.webp`
- Create: `static/img/brand/revenza-upsell-3d.webp`
- Create: `static/img/brand/revenza-hero-3d.webp`
- Create: `static/img/brand/revenza-logo-source.png`
- Create: `static/img/apps/revenza-upsell-source.png`

- [ ] **Step 1: Copy the two supplied source assets into the project**

Run:

```powershell
New-Item -ItemType Directory -Force static/img/brand, static/img/apps
Copy-Item -LiteralPath 'D:\Revenza Techies Database\Revenza Techies\4K logo\Revenza logo_4K_3840x2160.png' -Destination 'static/img/brand/revenza-logo-source.png'
Copy-Item -LiteralPath 'D:\Revenza Techies Database\04. Apps Data\01. Upsell Addons App\01. Upsell App Logos\Upsell logo-1.png' -Destination 'static/img/apps/revenza-upsell-source.png'
```

Expected: both project-local PNG files exist and remain visually unchanged.

- [ ] **Step 2: Generate the 3D corporate brand object with built-in ImageGen**

Use the corporate logo as the reference image and this prompt:

```text
Use case: logo-brand
Asset type: responsive website hero brand object
Primary request: transform the supplied Revenza R-and-arrow logo into a premium dimensional 3D emblem while preserving the exact recognizable R silhouette, upward arrow direction, navy-to-teal color identity, and small warm orange accent.
Input image: supplied Revenza corporate logo as the identity reference.
Style/medium: polished 3D product render, softly beveled edges, premium SaaS brand object.
Composition/framing: centered isolated emblem, generous padding, three-quarter perspective, readable at 160px and 480px.
Lighting/mood: soft studio lighting, restrained reflections, confident and trustworthy.
Constraints: preserve brand recognition; no extra letters; no slogan; no watermark; no busy background.
Avoid: plastic toy appearance, chrome overload, neon glow, distorted arrow, illegible geometry.
```

Save the selected final as `static/img/brand/revenza-brand-3d.webp`.

- [ ] **Step 3: Generate the 3D Revenza Upsell artwork with built-in ImageGen**

Use the Upsell logo as the reference image and this prompt:

```text
Use case: logo-brand
Asset type: vertical Shopify app directory card artwork
Primary request: transform the supplied Revenza Upsell Addon shopping-cart artwork into a compact premium 3D app illustration while preserving the blue cart, upward motion, colorful products, and recognizable Revenza Upsell identity.
Input image: supplied Revenza Upsell Addon logo as the identity reference.
Style/medium: polished 3D ecommerce icon, rounded dimensional forms, crisp product-render finish.
Composition/framing: square centered artwork with tight but safe padding, readable inside a 280px-wide vertical card.
Lighting/mood: bright studio lighting, friendly and trustworthy.
Constraints: keep the artwork compact; no added UI; no watermark; no illegible text.
Avoid: excessive whitespace, photoreal people, unrelated products, harsh shadows, visual clutter.
```

Save the selected final as `static/img/brand/revenza-upsell-3d.webp`.

- [ ] **Step 4: Generate the wide 3D homepage background with built-in ImageGen**

Use both supplied logos as brand references and this prompt:

```text
Use case: stylized-concept
Asset type: desktop and mobile website hero background
Primary request: create an elegant 3D ecommerce growth scene for the Revenza Help Center using floating product blocks, a subtle shopping cart motif, directional growth forms, and abstract documentation panels.
Input images: Revenza corporate logo for palette and brand language; Revenza Upsell logo for ecommerce cues only.
Style/medium: premium soft 3D illustration, clean SaaS product-render aesthetic.
Composition/framing: 2048x1152 landscape; visual interest concentrated on the right half; calm negative space on the left for headline and supporting copy; safe central crop for tablet and mobile.
Lighting/mood: soft studio lighting, airy depth, polished and optimistic.
Color palette: navy, teal, sky blue, restrained orange, warm cream.
Constraints: no text, no watermark, no fake interface labels, no people, no brand-logo distortion.
Avoid: busy collage, dark background, excessive glow, tiny details, low contrast.
```

Save the selected final as `static/img/brand/revenza-hero-3d.webp`.

- [ ] **Step 5: Validate image dimensions and file sizes**

Run:

```powershell
py -3 -c "from PIL import Image; from pathlib import Path; files=list(Path('static/img/brand').glob('*.webp')); assert len(files)==3; [(print(p.name, Image.open(p).size, p.stat().st_size), Image.open(p).verify()) for p in files]"
```

Expected: three valid WebP files; hero at least `1536px` wide; each logo asset at least `768px` on its longest edge; total generated asset weight targeted below `1.5 MB`.

- [ ] **Step 6: Commit the brand assets**

```powershell
git add static/img/brand static/img/apps
git commit -m "feat: add Revenza 3D brand assets"
```

## Task 3: Add the Animated Brand Scene

**Files:**
- Create: `src/components/BrandScene/index.js`
- Create: `src/components/BrandScene/styles.module.css`
- Modify: `src/pages/index.js`
- Modify: `src/pages/index.module.css`

- [ ] **Step 1: Create the brand scene component**

Create `src/components/BrandScene/index.js`:

```jsx
import React from 'react';
import styles from './styles.module.css';

export default function BrandScene() {
  return (
    <div className={styles.scene} aria-hidden="true">
      <img
        className={styles.background}
        src="/img/brand/revenza-hero-3d.webp"
        alt=""
        width="2048"
        height="1152"
        decoding="async"
        fetchPriority="high"
      />
      <img
        className={styles.brand}
        src="/img/brand/revenza-brand-3d.webp"
        alt=""
        width="900"
        height="900"
        decoding="async"
      />
    </div>
  );
}
```

- [ ] **Step 2: Add GPU-friendly motion**

Create `src/components/BrandScene/styles.module.css` with:

```css
.scene {
  position: relative;
  min-height: 480px;
  perspective: 1200px;
  isolation: isolate;
}

.background,
.brand {
  position: absolute;
  display: block;
  height: auto;
  object-fit: contain;
  will-change: transform;
}

.background {
  inset: 0;
  width: 100%;
  animation: sceneDrift 12s ease-in-out infinite alternate;
}

.brand {
  right: 8%;
  top: 11%;
  width: min(34%, 220px);
  filter: drop-shadow(0 24px 32px rgba(7, 49, 77, 0.22));
  animation: brandFloat 6s ease-in-out infinite;
}

@keyframes sceneDrift {
  from { transform: rotateY(-2deg) translate3d(-6px, 0, 0) scale(1.01); }
  to { transform: rotateY(2deg) translate3d(8px, -8px, 0) scale(1.03); }
}

@keyframes brandFloat {
  0%, 100% { transform: translate3d(0, 0, 30px) rotate(-2deg); }
  50% { transform: translate3d(0, -14px, 54px) rotate(2deg); }
}

@media (max-width: 768px) {
  .scene { min-height: 330px; }
  .brand { right: 5%; width: min(38%, 150px); }
}

@media (prefers-reduced-motion: reduce) {
  .background,
  .brand {
    animation: none;
    transform: none;
  }
}
```

- [ ] **Step 3: Integrate the scene into the hero**

Update `src/pages/index.js` to import `BrandScene` and render a two-column hero:

```jsx
import BrandScene from '../components/BrandScene';

<section className={styles.hero}>
  <div className={styles.heroInner}>
    <div className={styles.heroCopy}>
      {/* preserve eyebrow, heading, paragraph, and browse control */}
    </div>
    <BrandScene />
  </div>
</section>
```

- [ ] **Step 4: Update responsive hero layout**

Update `src/pages/index.module.css`:

```css
.heroInner {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(420px, 1.08fr);
  align-items: center;
  gap: clamp(24px, 5vw, 72px);
}

.heroCopy {
  position: relative;
  z-index: 2;
}

.hero h1,
.hero p {
  margin-left: 0;
  text-align: left;
}

@media (max-width: 900px) {
  .heroInner {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 5: Build and verify**

Run:

```powershell
npm run build
```

Expected: `Generated static files in "build"`.

- [ ] **Step 6: Commit the hero**

```powershell
git add src/components/BrandScene src/pages/index.js src/pages/index.module.css
git commit -m "feat: add animated Revenza hero scene"
```

## Task 4: Redesign the Revenza Upsell Card as a Compact Vertical Card

**Files:**
- Modify: `src/data/apps.js`
- Modify: `src/components/AppCard/index.js`
- Modify: `src/components/AppCard/styles.module.css`
- Modify: `src/pages/index.module.css`

- [ ] **Step 1: Add image metadata to the app data**

Update the Revenza Upsell entry in `src/data/apps.js`:

```js
{
  name: 'Revenza Upsell',
  slug: 'revenza-upsell',
  intro: 'Show relevant add-ons and upsells that help customers discover more.',
  category: 'Sales and conversion',
  href: '/revenza-upsell',
  image: '/img/brand/revenza-upsell-3d.webp',
  imageAlt: 'Revenza Upsell shopping cart app artwork',
}
```

- [ ] **Step 2: Replace the initials block with real artwork**

Update `src/components/AppCard/index.js`:

```jsx
<div className={styles.artwork}>
  <img
    src={app.image}
    alt={app.imageAlt}
    width="768"
    height="768"
    loading="lazy"
    decoding="async"
  />
</div>
```

- [ ] **Step 3: Make the card compact and vertical**

Replace the main layout rules in `src/components/AppCard/styles.module.css`:

```css
.card {
  display: grid;
  width: min(100%, 360px);
  min-height: 0;
  grid-template-rows: auto auto auto;
  gap: 18px;
  padding: 20px;
  justify-self: start;
}

.artwork {
  display: grid;
  aspect-ratio: 1 / 0.78;
  place-items: center;
  overflow: hidden;
  background: linear-gradient(145deg, #eef9ff, #fff4e8);
  border-radius: 16px;
}

.artwork img {
  width: 88%;
  height: 88%;
  object-fit: contain;
  animation: appFloat 5.5s ease-in-out infinite;
}

.copy h2 {
  margin: 0 0 8px;
  font-size: 1.55rem;
}

.copy p {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
```

- [ ] **Step 4: Preserve multi-app scalability**

Update `src/pages/index.module.css`:

```css
.appGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 360px));
  gap: 24px;
  align-items: start;
}
```

- [ ] **Step 5: Verify reduced motion**

Add to the card stylesheet:

```css
@media (prefers-reduced-motion: reduce) {
  .artwork img {
    animation: none;
  }
}
```

- [ ] **Step 6: Build and commit**

```powershell
npm run build
git add src/data/apps.js src/components/AppCard src/pages/index.module.css
git commit -m "feat: redesign app cards with 3D artwork"
```

Expected: build passes and the card remains under `360px` wide at desktop.

## Task 5: Add Web3Forms Contact Logic with Tests

**Files:**
- Create: `src/utils/contactForm.js`
- Create: `src/utils/contactForm.test.js`
- Modify: `package.json`

- [ ] **Step 1: Add the test command**

Update `package.json`:

```json
"scripts": {
  "test": "node --test src/**/*.test.js",
  "start": "docusaurus start",
  "build": "docusaurus build",
  "serve": "docusaurus serve",
  "clear": "docusaurus clear"
}
```

- [ ] **Step 2: Write failing validation tests**

Create `src/utils/contactForm.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const {validateContactForm, createWeb3FormsPayload} = require('./contactForm');

test('requires name, valid email, subject, and message', () => {
  assert.deepEqual(validateContactForm({name:'', email:'bad', subject:'', message:''}), {
    name: 'Enter your name.',
    email: 'Enter a valid email address.',
    subject: 'Choose a subject.',
    message: 'Tell us how we can help.',
  });
});

test('accepts a complete merchant support request', () => {
  assert.deepEqual(validateContactForm({
    name: 'Asha',
    email: 'asha@example.com',
    subject: 'App setup',
    storeUrl: 'https://example.myshopify.com',
    message: 'The app block is not visible.',
  }), {});
});

test('creates the Web3Forms payload without dropping store context', () => {
  const payload = createWeb3FormsPayload({
    name: 'Asha',
    email: 'asha@example.com',
    subject: 'App setup',
    storeUrl: 'https://example.myshopify.com',
    message: 'The app block is not visible.',
  }, 'test-key');
  assert.equal(payload.access_key, 'test-key');
  assert.equal(payload.from_name, 'Revenza Help Center');
  assert.equal(payload.store_url, 'https://example.myshopify.com');
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run:

```powershell
npm test
```

Expected: FAIL because `src/utils/contactForm.js` does not exist.

- [ ] **Step 4: Implement validation and payload construction**

Create `src/utils/contactForm.js`:

```js
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContactForm(values) {
  const errors = {};
  if (!values.name?.trim()) errors.name = 'Enter your name.';
  if (!EMAIL_PATTERN.test(values.email?.trim() || '')) {
    errors.email = 'Enter a valid email address.';
  }
  if (!values.subject?.trim()) errors.subject = 'Choose a subject.';
  if (!values.message?.trim()) errors.message = 'Tell us how we can help.';
  return errors;
}

function createWeb3FormsPayload(values, accessKey) {
  return {
    access_key: accessKey,
    from_name: 'Revenza Help Center',
    subject: `[Revenza Support] ${values.subject}`,
    name: values.name.trim(),
    email: values.email.trim(),
    store_url: values.storeUrl?.trim() || 'Not provided',
    message: values.message.trim(),
    botcheck: '',
  };
}

module.exports = {validateContactForm, createWeb3FormsPayload};
```

- [ ] **Step 5: Run tests to verify they pass**

Run:

```powershell
npm test
```

Expected: `3` tests pass, `0` fail.

- [ ] **Step 6: Commit contact logic**

```powershell
git add package.json package-lock.json src/utils
git commit -m "test: add contact form validation"
```

## Task 6: Build the Accessible Web3Forms Contact Page

**Files:**
- Create: `src/components/ContactForm/index.js`
- Create: `src/components/ContactForm/styles.module.css`
- Create: `src/pages/contact.js`
- Create: `src/pages/contact.module.css`
- Create: `.env.example`
- Modify: `docusaurus.config.js`

- [ ] **Step 1: Expose the build-time access key**

Add to the Docusaurus config:

```js
customFields: {
  web3formsAccessKey: process.env.WEB3FORMS_ACCESS_KEY || '',
},
```

Create `.env.example`:

```dotenv
WEB3FORMS_ACCESS_KEY=replace-with-your-web3forms-access-key
```

- [ ] **Step 2: Implement the form component**

Create `src/components/ContactForm/index.js` with:

```jsx
import React, {useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {CheckCircle, PaperPlaneTilt, WarningCircle} from '@phosphor-icons/react';
import {createWeb3FormsPayload, validateContactForm} from '../../utils/contactForm';
import styles from './styles.module.css';

const initialValues = {name:'', email:'', storeUrl:'', subject:'', message:''};

export default function ContactForm() {
  const {siteConfig} = useDocusaurusContext();
  const accessKey = siteConfig.customFields.web3formsAccessKey;
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    if (!accessKey) {
      setStatus('error');
      setStatusMessage('The contact form is not configured yet. Email support@revenza.in.');
      return;
    }

    setStatus('submitting');
    setStatusMessage('');
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify(createWeb3FormsPayload(values, accessKey)),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);
      setValues(initialValues);
      setStatus('success');
      setStatusMessage('Thanks. Your message has been sent to the Revenza team.');
    } catch {
      setStatus('error');
      setStatusMessage('We could not send your message. Please try again or email support@revenza.in.');
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* render labeled name, email, optional store URL, subject select, message,
          hidden botcheck, field-level errors, submit button, and role=status feedback */}
      <button type="submit" disabled={status === 'submitting'}>
        <PaperPlaneTilt size={20} />
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
      <div className={styles.status} role="status" aria-live="polite">
        {status === 'success' && <CheckCircle size={20} />}
        {status === 'error' && <WarningCircle size={20} />}
        {statusMessage}
      </div>
    </form>
  );
}
```

The implementation must render complete labels, `aria-describedby` links, `aria-invalid`, and inline errors for every required field.

- [ ] **Step 3: Add contact page SEO and structured data**

Create `src/pages/contact.js` with:

```jsx
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
          <p>Share your app question and store context. We will use it to give you a more useful reply.</p>
        </section>
        <div className={styles.layout}>
          <ContactForm />
          <aside className={styles.details}>
            <EnvelopeSimple size={24} />
            <h2>Prefer email?</h2>
            <a href="mailto:support@revenza.in">support@revenza.in</a>
            <Headset size={24} />
            <h2>Useful details</h2>
            <p>Include the app name, store URL, affected product, and a screenshot when possible.</p>
            <Timer size={24} />
            <h2>Response time</h2>
            <p>We will reply as soon as a support specialist is available.</p>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
```

- [ ] **Step 4: Style responsive and accessible states**

Create CSS Modules with:

- A maximum content width of `1120px`.
- Two columns above `900px`, one column below.
- Minimum control height of `48px`.
- Visible focus rings using the Revenza teal token.
- Error text paired with both color and icon/text.
- Submit button disabled state with no layout shift.
- Success and error surfaces with AA contrast.

- [ ] **Step 5: Build without a key and verify fallback**

Run:

```powershell
Remove-Item Env:WEB3FORMS_ACCESS_KEY -ErrorAction SilentlyContinue
npm run build
```

Expected: build passes; submitting locally shows the configuration fallback rather than sending.

- [ ] **Step 6: Build with a test key**

Run:

```powershell
$env:WEB3FORMS_ACCESS_KEY='test-key'
npm run build
```

Expected: build passes and the serialized Docusaurus config contains a non-empty test key. Do not commit `.env` or a real key.

- [ ] **Step 7: Commit the contact page**

```powershell
git add .env.example docusaurus.config.js src/components/ContactForm src/pages/contact.* src/utils
git commit -m "feat: add Web3Forms contact page"
```

## Task 7: Update Navigation, Brand Tokens, and Deployment Secrets

**Files:**
- Modify: `docusaurus.config.js`
- Modify: `src/css/custom.css`
- Modify: `.github/workflows/deploy.yml`
- Modify: `.gitignore`
- Modify: `README.md`

- [ ] **Step 1: Add Contact to navbar and footer**

Add:

```js
{to: '/contact', label: 'Contact', position: 'left'}
```

Add footer link:

```js
{label: 'Contact support', to: '/contact'}
```

- [ ] **Step 2: Use the supplied brand logo in the navbar**

Update:

```js
navbar: {
  title: 'Revenza Help Center',
  logo: {
    alt: 'Revenza',
    src: 'img/brand/revenza-logo-source.png',
  },
}
```

Constrain it in `src/css/custom.css`:

```css
.navbar__logo {
  width: 42px;
  height: 42px;
  overflow: hidden;
  border-radius: 10px;
}

.navbar__logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 36%;
}
```

- [ ] **Step 3: Align tokens to the supplied brand**

Update global colors:

```css
:root {
  --ifm-color-primary: #0b7890;
  --revenza-navy: #07314d;
  --revenza-teal: #0f9792;
  --revenza-sky: #1ba7e4;
  --revenza-orange: #ff8a24;
}
```

Retain plum only as a secondary documentation accent where it remains visible in the selected docs design.

- [ ] **Step 4: Pass the GitHub secret to the build**

Update `.github/workflows/deploy.yml`:

```yaml
- run: npm run build
  env:
    WEB3FORMS_ACCESS_KEY: ${{ secrets.WEB3FORMS_ACCESS_KEY }}
```

- [ ] **Step 5: Document setup**

Add to `README.md`:

```md
## Web3Forms

1. Create a Web3Forms access key for `support@revenza.in`.
2. Add `WEB3FORMS_ACCESS_KEY` as a GitHub Actions repository secret.
3. For local testing, set the environment variable in PowerShell:
   `$env:WEB3FORMS_ACCESS_KEY='your-key'`
4. Never commit the real access key.
```

- [ ] **Step 6: Build and commit**

```powershell
npm test
npm run build
git add docusaurus.config.js src/css/custom.css .github/workflows/deploy.yml .gitignore README.md
git commit -m "chore: finish brand and contact deployment setup"
```

Expected: tests and build both pass.

## Task 8: Responsive, Accessibility, SEO, and Visual QA

**Files:**
- Create: `design-qa.md`
- Modify: files identified by QA

- [ ] **Step 1: Serve the production build**

Run:

```powershell
npm run serve -- --host 127.0.0.1 --port 3000
```

- [ ] **Step 2: Verify routes**

Check:

```text
/
/contact
/revenza-upsell
/revenza-upsell/faq
/changelog
/manifest.json
/sitemap.xml
/robots.txt
```

Expected: HTTP `200` for every route.

- [ ] **Step 3: Verify visual breakpoints**

Capture and inspect:

- `1440 x 1024`: hero copy and 3D scene balance; compact card at or below `360px`.
- `768 x 1024`: hero stacks without cropping essential brand forms.
- `390 x 844`: no horizontal overflow; app card and contact controls fit the viewport.

- [ ] **Step 4: Verify form states**

Check:

- Empty submit exposes all required-field errors.
- Invalid email is rejected before network submission.
- Missing key produces configuration fallback.
- Valid test submission shows loading then success.
- Network failure shows retry guidance and direct-email fallback.
- Keyboard tab order follows the visual order.

- [ ] **Step 5: Verify motion accessibility**

Enable reduced motion and confirm:

- Hero background is static.
- Corporate brand object is static.
- Upsell card artwork is static.
- Hover and focus affordances remain visible.

- [ ] **Step 6: Verify SEO output**

Assert built HTML contains:

- Canonical URLs for `/` and `/contact`.
- `CollectionPage` structured data on `/`.
- `ContactPage` structured data on `/contact`.
- `SoftwareApplication` entry for Revenza Upsell.
- Contact route in `sitemap.xml`.
- Manifest and social image references.

- [ ] **Step 7: Write the QA report**

Create `design-qa.md` with:

```md
source visual truth:
- supplied Revenza corporate logo
- supplied Revenza Upsell logo
- approved Revenza knowledge-base design direction

implementation routes:
- http://127.0.0.1:3000/
- http://127.0.0.1:3000/contact

viewports:
- 1440x1024
- 768x1024
- 390x844

findings:
- fonts and typography
- spacing and layout rhythm
- colors and brand tokens
- generated image quality
- copy and content
- interaction and form states

final result: passed
```

Do not mark `passed` until there are no actionable P0, P1, or P2 findings.

- [ ] **Step 8: Run final verification**

```powershell
npm test
npm run build
git status --short
```

Expected: all tests pass, production build succeeds, and only intended files remain.

- [ ] **Step 9: Commit QA fixes**

```powershell
git add .
git commit -m "fix: complete responsive and accessibility QA"
```

## Task 9: Push to GitHub

**Files:**
- No source changes expected

- [ ] **Step 1: Confirm authentication and branch**

```powershell
gh auth status
git branch --show-current
git remote -v
```

Expected: authenticated GitHub account, branch `main`, correct Revenza remote.

- [ ] **Step 2: Review commits**

```powershell
git status --short
git log --oneline --decorate -8
```

Expected: clean worktree and scoped commits from this plan.

- [ ] **Step 3: Push**

```powershell
git push -u origin main
```

Expected: `main` is published to `revenza-techies/Revenza-Apps-KB`.

- [ ] **Step 4: Configure the Web3Forms secret**

In GitHub repository settings, create the Actions secret:

```text
WEB3FORMS_ACCESS_KEY
```

Use the real Web3Forms access key as its value.

- [ ] **Step 5: Verify GitHub Pages**

Confirm the GitHub Actions deployment succeeds and these production URLs return `200`:

```text
https://docs.revenza.in/
https://docs.revenza.in/contact
https://docs.revenza.in/revenza-upsell
```

## Self-Review

- Spec coverage: contact page, Web3Forms integration, corporate brand logo, 3D animated brand object, 3D hero background, vertical compact Upsell card, supplied app artwork, responsive design, SEO, local-first development, commit, and push are all mapped to tasks.
- Security: the Web3Forms access key is never committed; deployment reads it from GitHub Actions secrets.
- Performance: generated imagery uses WebP, explicit dimensions, responsive containment, and transform-only animation.
- Accessibility: all motion has reduced-motion fallbacks; form controls have labels, validation descriptions, status announcements, and keyboard focus.
- Maintainability: app metadata stays data-driven; image generation outputs are project assets; contact validation remains independently testable.
- Static-hosting constraint: no server runtime is introduced; the only external form dependency is the user-approved Web3Forms API.
