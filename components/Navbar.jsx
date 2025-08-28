'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/">HealthAI</Link>
      </div>
      <div className={styles.links}>
        <Link href="/symptom-checker">Symptom Checker</Link>
        <Link href="/lab-interpreter">Lab Interpreter</Link>
        <Link href="/conditions">Conditions</Link>
        <Link href="/drug-interactions">Drugs</Link>
        <Link href="/medication-reminders">Reminders</Link>
        <Link href="/symptom-journal">Journal</Link>
      </div>
    </nav>
  );
}
