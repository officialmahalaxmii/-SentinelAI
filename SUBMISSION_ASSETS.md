# SentinelAI: HackCulture Submission Materials & Demo Script

This document contains copy-paste-ready answers for the HackCulture GFF 2026 submission form, alongside a professional 60-90 second live-demo presentation script.

---

## Part A: Demo Video Script (60–90 Seconds)

**Visual Focus**: Screen recording of the SentinelAI browser application.

### [0:00 - 0:15] Hook & The Problem
*   **Speaker Voice**: "As retail investing booms across India, bad actors are weaponizing generative AI. Hyper-personalized phishing SMSs, deepfake videos of CIOs urging panic liquidations, and WhatsApp AI voice clones of CEOs are scamming retail investors. Simultaneously, investors have no reliable way to verify legitimate announcements from SEBI, NSE, or official brokerages."
*   **Visual**: Show the **Threat Analyzer** tab.

### [0:15 - 0:35] Demo of DETECT Engine
*   **Speaker Voice**: "To solve this, SentinelAI introduces a bidirectional shield. First, our **DETECT Engine** runs linguistic stylometry and forensic AI-pattern analysis using Gemini 3.5 models. Let's select the 'CEO Bonus Insider Audio' scenario preset. Clicking run instantly analyzes synthetic markers. We detect LLM writing templates with an 85% synthetic confidence rating and provide immediate protective instructions."
*   **Visual**: Click on the CEO Voice Clone scenario preset, click "RUN SENTINEL SCAN", scroll down to show the Critical Risk report and linguistic gauges.

### [0:35 - 1:00] Demo of VERIFY Engine (Tamper Demo)
*   **Speaker Voice**: "Second, we solve the trust deficit with our **VERIFY Engine**. Official issuers like SEBI can instantly stamp directives with a cryptographic HMAC-SHA256 seal. Let's sign this portfolio circular. It generates a digital stamp payload. Now, copy this text and stamp."
*   **Visual**: Switch to **Communication Stamps** tab. Select SEBI as issuer. Click "GENERATE DIGITAL STAMP". Click "COPY PAYLOAD".

### [1:00 - 1:20] The Climax: Tampering Blocked
*   **Speaker Voice**: "When an investor pastes this payload into the Stamp Verifier, it resolves to an AUTHENTICITY SECURED badge. But look what happens if an attacker tries to tamper with it — say, by appending a fraudulent WhatsApp link. Our seal instantly invalidates, alerting the investor. This is foolproof non-repudiation!"
*   **Visual**: Paste the stamp payload into the Verifier. Click "VERIFY" to show the Green badge. Click the "Simulate Tamper" button. Click "VERIFY" again to see the Red alert badge.

### [1:20 - 1:30] Conclusion
*   **Speaker Voice**: "SentinelAI turns retail vulnerability into absolute cryptographic trust. Securing investors, securing the markets."
*   **Visual**: Show the **System Benchmarks** and **Education Quiz** tabs.

---

## Part B: HackCulture Submission Form Answers

### 1. Project Title
`SentinelAI`

### 2. Project Subtitle / Tagline
`AI-Driven Fraud Shield and Cryptographic Trust Registry Securing Indian Retail Investors and Securities Markets`

### 3. Problem Statement & Context
`The democratization of trading in India has spawned severe systemic vulnerabilities. Fraudsters use generative AI to create realistic fake circulars, voice clone transcripts mimicking CEOs in market groups, and deepfake financial videos to orchestrate pump-and-dump schemes. Consequently, retail and first-generation investors face devastating financial losses. On the other side, legitimate regulators (SEBI, NSE, BSE, registered brokerages) lack any universal public mechanism to stamp announcements, making it impossible for retail investors to distinguish spoofed alerts from authentic regulatory directives.`

### 4. Technical Solution Overview
`SentinelAI implements a dual-defense architecture:
1. DETECT (AI Forensic Scanner): Leverages Gemini-3.5 models combined with stylized threat heuristics. It analyzes suspicious SMS, email, and media transcripts for LLM authorship structures, fake regulatory URLs, and urgency-driven fear tactics.
2. VERIFY (Cryptographic Trust Registry): Allows official issuers to digitally seal announcements using HMAC-SHA256. Investors instantly verify stamps using their broker terminals or our portal. Any textual tampering (e.g., modifying margin rules or injecting scam links) breaks the signature instantly, achieving total non-repudiation.`

### 5. Tech Stack & Implementation Details
`- Frontend: Single-Page React 19 app with Vite and Tailwind CSS v4, optimized for professional clarity and responsive touch targets.
- Backend: Express (Node.js) server proxying advanced Gemini-3.5 cognitive requests for safe API key isolation.
- Cryptography: Native 'crypto' package executing high-performance HMAC-SHA256 digests.
- Fallback Resilience: Pre-seeded scenarios and keyword heuristic rules ensuring the scanner runs 100% locally and offline without requiring active API keys or cloud connections.`

### 6. Social Impact & Market Potential
`SentinelAI protects the most vulnerable segment: first-generation retail investors operating off mobile chat groups. By integrating SentinelAI into terminal apps (Zerodha, Groww) and brokerage SMS routers, we create a secure communications filter. This safeguards retail investor capitals, shields brokers from liability, and restores the sovereign integrity of India's capital market communications.`
