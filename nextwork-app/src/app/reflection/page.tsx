"use client";

import React, { useState } from "react";
import styles from "./reflection.module.css";

export default function ReflectionPage() {
  const [reflection, setReflection] = useState("");
  const maxChars = 500;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxChars) {
      setReflection(e.target.value);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        {/* Top bar with icons and progress */}
        <div className={styles.topBar}>
          <div className={styles.iconCircle}>
            <PencilIcon />
          </div>
          <div className={styles.progressBadge}>
            Your progress — Step 1 of 8
          </div>
        </div>

        {/* Header section */}
        <div className={styles.header}>
          <h1 className={styles.title}>Reflect on this step</h1>
          <p className={styles.subtitle}>
            Take a moment to capture what you&apos;re doing and why it matters.
          </p>
        </div>

        {/* Main reflection input */}
        <div className={styles.section}>
          <div className={styles.sectionHeading}>
            <SparkleIcon />
            <span>What are we doing in this step?</span>
          </div>
          <p className={styles.supportingText}>
            Summarize the main goal of this step in your own words.
          </p>
          <div className={styles.textareaWrapper}>
            <textarea
              className={styles.textarea}
              placeholder="Example: In this step, I’m setting up a Next.js project so that I can build the foundations of my application."
              value={reflection}
              onChange={handleTextChange}
            />
            <div className={styles.charCount}>
              {reflection.length} / {maxChars}
            </div>
          </div>
        </div>

        {/* Tips section */}
        <div className={styles.tipsCard}>
          <div className={styles.tipsTitle}>
            <WritingIcon />
            <span>Tips to help you write</span>
          </div>
          <ul className={styles.tipsList}>
            <li className={styles.tipItem}>
              <CheckIcon />
              <span>Focus on the outcome, not the how</span>
            </li>
            <li className={styles.tipItem}>
              <CheckIcon />
              <span>Use your own words—imagine explaining it to a teammate</span>
            </li>
            <li className={styles.tipItem}>
              <CheckIcon />
              <span>Keep it short and clear (1–3 sentences is perfect)</span>
            </li>
          </ul>
        </div>

        {/* Footer section */}
        <div className={styles.footer}>
          <div className={styles.privacy}>
            <LockIcon />
            <span>This reflection is saved to your step and helps you track your learning.</span>
          </div>
          <button className={styles.saveButton}>Save reflection</button>
        </div>

        {/* Secondary View Work button */}
        <button className={styles.viewWorkButton}>
          <span style={{ marginRight: "8px" }}>✓</span> View My Work
        </button>
      </div>
    </main>
  );
}

// --- Icons (Inline SVGs) ---

function PencilIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg className={styles.sparkleIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5z" />
    </svg>
  );
}

function WritingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
