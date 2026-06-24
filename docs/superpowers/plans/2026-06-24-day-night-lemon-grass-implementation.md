---
draft: true
---

# Day and Night Lemon Grass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved sample-derived Day theme, a matching forest Night theme, a Day/Night-only selector, and a full-bleed animated 3D homepage hero.

**Architecture:** Keep Docusaurus’s `light` and `dark` internal theme values for compatibility, but present them to users exclusively as Day and Night through a swizzled color-mode toggle. Centralize all visual colors as semantic CSS tokens so documentation, homepage, contact form, search, cards, footer, and status states translate consistently between themes.

**Tech Stack:** Docusaurus 3.10, React 19, CSS Modules, Infima theme tokens, Node test runner, local Playwright/browser QA.

---

## Task 1: Add Testable Day and Night Theme Metadata

**Files:**
- Create: `src/theme/ColorModeToggle/themeModes.js`
- Create: `src/theme/ColorModeToggle/themeModes.test.js`
- Modify: `package.json`

- [ ] **Step 1: Write the failing theme-mode tests**

Create `src/theme/ColorModeToggle/themeModes.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const {THEME_MODES, getNextMode} = require('./themeModes');

test('exposes only Day and Night modes', () => {
  assert.deepEqual(Object.keys(THEME_MODES), ['light', 'dark']);
  assert.equal(THEME_MODES.light.label, 'Day');
  assert.equal(THEME_MODES.dark.label, 'Night');
});

test('toggles directly between Day and Night', () => {
  assert.equal(getNextMode('light'), 'dark');
  assert.equal(getNextMode('dark'), 'light');
});

test('falls back to Day for unknown modes', () => {
  assert.equal(getNextMode('system'), 'light');
  assert.equal(getNextMode(undefined), 'light');
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
npm test
```

Expected: FAIL because `src/theme/ColorModeToggle/themeModes.js` does not exist.

- [ ] **Step 3: Implement the minimal theme metadata**

Create `src/theme/ColorModeToggle/themeModes.js`:

```js
const THEME_MODES = {
  light: {
    label: 'Day',
    toggleLabel: 'Switch to Night mode',
  },
  dark: {
    label: 'Night',
    toggleLabel: 'Switch to Day mode',
  },
};

function getNextMode(mode) {
  if (mode === 'light') return 'dark';
  if (mode === 'dark') return 'light';
  return 'light';
}

module.exports = {THEME_MODES, getNextMode};
```

- [ ] **Step 4: Run tests and verify GREEN**

Run:

```powershell
npm test
```

Expected: all contact and theme tests pass.

- [ ] **Step 5: Commit**

```powershell
git add src/theme/ColorModeToggle/themeModes.js src/theme/ColorModeToggle/themeModes.test.js
git commit -m "test: define Day and Night theme behavior"
```

## Task 2: Replace Docusaurus Theme Selection with Day and Night

**Files:**
- Create: `src/theme/ColorModeToggle/index.js`
- Create: `src/theme/ColorModeToggle/styles.module.css`
- Modify: `docusaurus.config.js`

- [ ] **Step 1: Configure Day as the fixed initial mode**

Update `docusaurus.config.js`:

```js
colorMode: {
  defaultMode: 'light',
  disableSwitch: false,
  respectPrefersColorScheme: false,
},
```

Update the metadata theme color:

```js
{name: 'theme-color', content: '#fffefb'},
```

- [ ] **Step 2: Create the two-state toggle**

Create `src/theme/ColorModeToggle/index.js`:

```jsx
import React from 'react';
import {Moon, Sun} from '@phosphor-icons/react';
import {useColorMode} from '@docusaurus/theme-common';
import themeModes from './themeModes';
import styles from './styles.module.css';

const {THEME_MODES, getNextMode} = themeModes;

export default function ColorModeToggle({className}) {
  const {colorMode, setColorMode} = useColorMode();
  const currentMode = colorMode === 'dark' ? 'dark' : 'light';
  const nextMode = getNextMode(currentMode);
  const label = THEME_MODES[currentMode].toggleLabel;

  return (
    <button
      type="button"
      className={`${styles.toggle} ${className || ''}`}
      aria-label={label}
      title={label}
      onClick={() => setColorMode(nextMode)}>
      {currentMode === 'light' ? (
        <Moon size={20} weight="fill" aria-hidden="true" />
      ) : (
        <Sun size={20} weight="fill" aria-hidden="true" />
      )}
      <span>{THEME_MODES[currentMode].label}</span>
    </button>
  );
}
```

- [ ] **Step 3: Style the control for both themes**

Create `src/theme/ColorModeToggle/styles.module.css`:

```css
.toggle {
  display: inline-flex;
  min-width: 82px;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 11px;
  color: var(--revenza-ink);
  font: inherit;
  font-size: 0.82rem;
  font-weight: 750;
  background: var(--revenza-control);
  border: 1px solid var(--revenza-line);
  border-radius: 10px;
  cursor: pointer;
}

.toggle:focus-visible {
  outline: 3px solid var(--revenza-focus);
  outline-offset: 3px;
}

@media (max-width: 576px) {
  .toggle {
    min-width: 42px;
  }

  .toggle span {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }
}
```

- [ ] **Step 4: Verify no System behavior remains**

Run:

```powershell
rg -n "respectPrefersColorScheme|system|System" docusaurus.config.js src/theme
```

Expected: `respectPrefersColorScheme: false`; no System option in `src/theme`.

- [ ] **Step 5: Build and commit**

```powershell
npm test
npm run build
git add docusaurus.config.js src/theme/ColorModeToggle
git commit -m "feat: add Day and Night theme toggle"
```

## Task 3: Implement the Approved Day and Forest Night Tokens

**Files:**
- Modify: `src/css/custom.css`
- Modify: `src/components/AppCard/styles.module.css`
- Modify: `src/components/ContactForm/styles.module.css`
- Modify: `src/pages/contact.module.css`
- Modify: `docs/intro.mdx`

- [ ] **Step 1: Replace root tokens with the approved Day palette**

Define in `src/css/custom.css`:

```css
:root {
  --ifm-color-primary: #0d5b37;
  --ifm-color-primary-dark: #0b5030;
  --ifm-color-primary-darker: #0a4b2d;
  --ifm-color-primary-darkest: #083e25;
  --ifm-color-primary-light: #126a42;
  --ifm-color-primary-lighter: #167147;
  --ifm-color-primary-lightest: #1d8052;
  --ifm-background-color: #fffefb;
  --ifm-background-surface-color: #ffffff;
  --ifm-navbar-background-color: rgba(255, 255, 252, 0.96);
  --ifm-footer-background-color: #f8f9f3;
  --ifm-font-color-base: #15241d;
  --ifm-heading-color: #15241d;
  --revenza-forest: #0d5b37;
  --revenza-forest-deep: #174d34;
  --revenza-lemon: #c9db8d;
  --revenza-lemon-soft: #edf2df;
  --revenza-ink: #15241d;
  --revenza-muted: #59685f;
  --revenza-canvas: #fffefb;
  --revenza-surface: #ffffff;
  --revenza-surface-alt: #f8f9f3;
  --revenza-line: #dfe5d8;
  --revenza-control: #f8f8f3;
  --revenza-focus: #819c47;
  --revenza-danger: #a1281f;
  --revenza-success: #19643f;
}
```

- [ ] **Step 2: Add the forest Night translation**

Define:

```css
[data-theme='dark'] {
  --ifm-color-primary: #c9db8d;
  --ifm-background-color: #0d120d;
  --ifm-background-surface-color: #182218;
  --ifm-navbar-background-color: rgba(16, 22, 16, 0.97);
  --ifm-footer-background-color: #101610;
  --ifm-font-color-base: #f4f7ee;
  --ifm-heading-color: #f4f7ee;
  --ifm-toc-border-color: #33412c;
  --revenza-forest: #c9db8d;
  --revenza-forest-deep: #dbe8b2;
  --revenza-lemon: #c9db8d;
  --revenza-lemon-soft: #263122;
  --revenza-ink: #f4f7ee;
  --revenza-muted: #c5cdbb;
  --revenza-canvas: #0d120d;
  --revenza-surface: #182218;
  --revenza-surface-alt: #101610;
  --revenza-line: #33412c;
  --revenza-control: #1b2519;
  --revenza-focus: #dbe8b2;
  --revenza-danger: #ffb4ab;
  --revenza-success: #9de7bd;
}
```

- [ ] **Step 3: Remove obsolete plum, teal, orange, and hard-coded light surfaces**

Replace component-specific colors with semantic variables:

```css
background: var(--revenza-surface);
color: var(--revenza-ink);
border-color: var(--revenza-line);
```

Use `--revenza-lemon-soft` for active rows, icon tiles, card artwork surfaces, and subtle support panels.

- [ ] **Step 4: Update status colors and form contrast**

In `src/components/ContactForm/styles.module.css`, use:

```css
.success {
  color: var(--revenza-success);
  background: color-mix(in srgb, var(--revenza-success) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--revenza-success) 34%, transparent);
}

.error,
.error.status {
  color: var(--revenza-danger);
}
```

- [ ] **Step 5: Build and verify**

Run:

```powershell
npm test
npm run build
```

Expected: tests and build pass.

- [ ] **Step 6: Commit**

```powershell
git add src/css/custom.css src/components/AppCard/styles.module.css src/components/ContactForm/styles.module.css src/pages/contact.module.css docs/intro.mdx
git commit -m "feat: apply Lemon Grass Day and Night palette"
```

## Task 4: Convert the Homepage to a Full-Bleed 3D Hero

**Files:**
- Modify: `src/components/BrandScene/index.js`
- Modify: `src/components/BrandScene/styles.module.css`
- Modify: `src/pages/index.js`
- Modify: `src/pages/index.module.css`

- [ ] **Step 1: Remove the duplicated floating brand object**

Update `src/components/BrandScene/index.js`:

```jsx
import React from 'react';
import styles from './styles.module.css';

export default function BrandScene() {
  return <div className={styles.scene} aria-hidden="true" />;
}
```

- [ ] **Step 2: Make the scene cover the entire hero**

Update `src/components/BrandScene/styles.module.css`:

```css
.scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background-image: var(--revenza-hero-overlay), url('/img/brand/revenza-hero-3d.webp');
  background-position: center;
  background-size: cover;
  transform: scale(1.06);
  animation: heroDrift 14s ease-in-out infinite alternate;
}

@keyframes heroDrift {
  from { transform: scale(1.06) translate3d(-0.5%, 0, 0); }
  to { transform: scale(1.1) translate3d(0.8%, -0.6%, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .scene {
    animation: none;
    transform: scale(1.06);
  }
}
```

- [ ] **Step 3: Define theme-specific overlays**

In `src/pages/index.module.css`:

```css
.hero {
  --revenza-hero-overlay: linear-gradient(
    90deg,
    #fffefb 3%,
    rgba(255, 254, 251, 0.98) 36%,
    rgba(255, 254, 251, 0.62) 56%,
    rgba(255, 254, 251, 0.05) 86%
  );
  position: relative;
  min-height: 590px;
  overflow: hidden;
}

:global([data-theme='dark']) .hero {
  --revenza-hero-overlay: linear-gradient(
    90deg,
    #0d120d 3%,
    rgba(13, 18, 13, 0.98) 40%,
    rgba(13, 18, 13, 0.55) 64%,
    rgba(13, 18, 13, 0.08) 88%
  );
}
```

- [ ] **Step 4: Layer copy above the full-bleed scene**

Update `src/pages/index.js`:

```jsx
<section className={styles.hero}>
  <BrandScene />
  <div className={styles.heroInner}>
    <div className={styles.heroCopy}>
      {/* existing copy and browse control */}
    </div>
  </div>
</section>
```

Remove the separate `<BrandScene />` column from the grid.

- [ ] **Step 5: Add mobile overlays**

```css
@media (max-width: 900px) {
  .hero {
    --revenza-hero-overlay: linear-gradient(
      180deg,
      #fffefb 4%,
      rgba(255, 254, 251, 0.96) 52%,
      rgba(255, 254, 251, 0.2) 94%
    );
    min-height: 640px;
  }

  :global([data-theme='dark']) .hero {
    --revenza-hero-overlay: linear-gradient(
      180deg,
      #0d120d 4%,
      rgba(13, 18, 13, 0.96) 54%,
      rgba(13, 18, 13, 0.2) 94%
    );
  }
}
```

- [ ] **Step 6: Build and commit**

```powershell
npm run build
git add src/components/BrandScene src/pages/index.js src/pages/index.module.css
git commit -m "feat: add full-bleed animated 3D hero"
```

## Task 5: Run Day and Night Visual QA

**Files:**
- Modify: `design-qa.md`
- Modify: files identified by QA

- [ ] **Step 1: Build and serve**

```powershell
npm test
npm run build
npm run serve -- --host 127.0.0.1 --port 3001
```

- [ ] **Step 2: Capture six homepage screenshots**

Capture:

- Day: `1440x1024`, `768x1024`, `390x844`
- Night: `1440x1024`, `768x1024`, `390x844`

Verify:

- Background is full bleed and has no visible rectangular frame.
- Headline remains legible.
- 3D illustration remains recognizable.
- No horizontal overflow.
- Navigation and mode selector remain reachable.

- [ ] **Step 3: Capture contact and docs pages**

Capture Day and Night views of:

```text
/contact
/revenza-upsell
```

Verify text, form controls, sidebars, active rows, search, links, errors, and focus indicators.

- [ ] **Step 4: Verify mode behavior**

Check:

- First visit starts in Day.
- Toggle switches Day to Night and Night to Day.
- Selection survives reload.
- Browser/OS system preference does not change the selected mode.
- Accessible toggle label announces the destination mode.

- [ ] **Step 5: Run contrast assertions**

Use a contrast checker for:

- Day main text on canvas.
- Day secondary text on canvas.
- Night main text on canvas.
- Night secondary text on canvas.
- Forest and lemon links on both surfaces.
- Contact form errors and success messages.

Expected: at least `4.5:1` for normal text and `3:1` for large text and UI boundaries.

- [ ] **Step 6: Update QA report**

Write `design-qa.md` with:

```md
source visual truth:
- C:/Users/KV Rogers/Downloads/Generated image 3.png
- approved Day homepage preview

themes:
- Day
- Night

viewports:
- 1440x1024
- 768x1024
- 390x844

required checks:
- typography and contrast
- full-bleed hero composition
- Lemon Grass palette fidelity
- responsive layout
- search, navigation, docs, and contact form
- reduced motion

final result: passed
```

- [ ] **Step 7: Final verification and commit**

```powershell
npm test
npm run build
git diff --check
git status --short
git add .
git commit -m "fix: complete Day and Night visual QA"
```

Expected: tests pass, build succeeds, and QA says `final result: passed`.

## Self-Review

- Day mode matches the approved sample’s warm-white, forest-green, pale lemon-grass, flat-surface design.
- Night mode is a direct token translation with accessible warm-white text.
- System mode is disabled.
- The toggle exposes only Day and Night.
- The homepage image is full bleed with no boxed frame.
- Desktop, tablet, and mobile overlays are explicitly defined.
- Documentation, contact, card, navbar, search, footer, form, and status colors are covered.
- TDD covers the only new behavior-bearing function: Day/Night mode switching.
