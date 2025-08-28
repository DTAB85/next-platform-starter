'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import Navbar from '../components/Navbar';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <h1 className={styles.title}>AIDoc</h1>
      

        <div className={styles.grid}>
          <FeatureCard title="🧠 Symptom Checker" href="/symptom-checker" />
          <FeatureCard title="🧪 Lab Test Interpreter" href="/lab-interpreter" />
          <FeatureCard title="📋 Condition Database" href="/conditions" />
          <FeatureCard title="💊 Drug Interactions" href="/drug-interactions" />
          <FeatureCard title="📅 Medication Reminders" href="/medication-reminders" />
          <FeatureCard title="📝 Symptom Journal" href="/symptom-journal" />
        </div>
      </main>
    </>
  );
}

function FeatureCard({ title, href }) {
  return (
    <Link href={href} className={styles.card}>
      <div>{title}</div>
    </Link>
  );
}
