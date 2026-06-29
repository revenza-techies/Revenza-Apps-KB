import React from 'react';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {
  ArrowSquareOut,
  ImageSquare,
  LockKey,
  PencilSimpleLine,
} from '@phosphor-icons/react';
import {adminWorkflow} from '../data/adminWorkflow';
import styles from './admin.module.css';

function StepList({items}) {
  return (
    <ol className={styles.steps}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ol>
  );
}

export default function AdminPage() {
  return (
    <Layout
      title="Admin Publishing Workflow"
      description="Private workflow guidance for Revenza Help Center administrators.">
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className={styles.page}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Revenza admins</span>
          <Heading as="h1">{adminWorkflow.title}</Heading>
          <p>
            This page keeps admin instructions away from the customer navigation
            while preserving a secure workflow. Admin access still happens on
            GitHub, not through a password form on the public help center.
          </p>
          <a className={styles.primaryAction} href={adminWorkflow.repositoryUrl}>
            Open GitHub repository
            <ArrowSquareOut size={18} weight="bold" />
          </a>
        </section>

        <section className={styles.grid} aria-label="Admin workflow details">
          <article className={styles.card}>
            <PencilSimpleLine size={30} weight="duotone" />
            <h2>Edit help content</h2>
            <p>
              Use Markdown files in <code>{adminWorkflow.docsPath}</code> for
              app guides and <code>{adminWorkflow.changelogPath}</code> for
              release updates.
            </p>
            <StepList items={adminWorkflow.editingSteps} />
          </article>

          <article className={styles.card}>
            <ImageSquare size={30} weight="duotone" />
            <h2>Upload article images</h2>
            <p>
              Place screenshots and tutorial images in{' '}
              <code>{adminWorkflow.imageUploadPath}</code>, then reference them
              from any Markdown article.
            </p>
            <StepList items={adminWorkflow.imageSteps} />
          </article>

          <article className={styles.card}>
            <LockKey size={30} weight="duotone" />
            <h2>Security rules</h2>
            <p>
              The public site must never collect GitHub credentials or expose
              repository tokens. Use GitHub's own authentication and permissions.
            </p>
            <ul className={styles.notes}>
              {adminWorkflow.securityNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </article>
        </section>
      </main>
    </Layout>
  );
}