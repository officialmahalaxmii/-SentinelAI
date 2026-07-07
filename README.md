# SentinelAI: AI-Driven Fraud Shield & Trust Verification Registry for Securities Markets

**Prototype Submission for the SEBI Securities Market TechSprint @ GFF 2026**
*HackCulture Platform • Round 02 Submission (Working Prototype + Demo Guide)*

---

## 📌 Problem Statement
The rapid democratization of retail investing has introduced a new class of threats to the Indian securities market ecosystem:
1. **Hostile AI & Synthetic Fraud**: Attackers can generate hyper-personalized phishing alerts via SMS/Telegram, synthetic audio voice clones mimicking company executives, and deepfake videos of market experts urging retail investors to liquidate holdings.
2. **The Institutional Trust Deficit**: Official regulatory and broker communications are highly vulnerable to spoofing, as investors lack a unified, non-repudiable mechanism to verify that a circular or announcement is genuine.

---

## 🛡️ The SentinelAI Dual-Engine Approach
SentinelAI delivers an end-to-end cyber-defense framework that protects the securities ecosystem on both fronts:

### 1. DETECT (Advanced Linguistic Scanner)
An AI-powered forensics scanner that evaluates financial messages and transcripts for malicious and synthetic markers:
* **Generative AI Footprints**: Scans for LLM syntax, generic robotic phrases, and excessive structural balance.
* **Social Engineering Traps**: Analyzes for high-pressure scare tactics, urgent deadline baits, and fake non-governmental domains.
* **Deepfake Executive Stylometry**: Analyzes translated audio/video scripts for abnormal sentiment, market manipulation prompts, and pump-and-dump keywords.

### 2. VERIFY (Cryptographic Communication Stamps)
A high-integrity registry based on HMAC-SHA256 seals, solving the trust deficit:
* **Digital Communication Stamps**: Registered entities (SEBI, NSE, BSE, registered brokerages) sign their announcements with secure cryptographic keys.
* **Tamper Prevention & Non-Repudiation**: When an official notice is stamped, the cryptographic hash covers the full content text. If an attacker appends a fraudulent link or alters margin rules, the verification seal instantly breaks.

---

## 🛠️ Technical Architecture
* **Frontend**: React 19, Tailwind CSS v4, Lucide Icons, and Motion for sleek, professional animations.
* **Backend**: Node.js, Express, and Google Gemini 3.5 Flash Model SDK (`@google/genai`).
* **Cryptographic Engine**: Node.js `crypto` module (HMAC-SHA256).
* **Robust Offline Simulation Engine**: SentinelAI includes a high-fidelity local keyword heuristic analyzer and scenario-matching caching layer, ensuring 100% demo-readiness offline or when the cloud API key is missing.

---

## 🚀 Installation & Local Execution

### Prerequisites
* **Node.js** v18+ 
* **npm** v9+

### Setup Steps
1. **Clone the project & install dependencies**:
   ```bash
   npm install
   ```
2. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Google Gemini API Key:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   ```
   *(Note: If no API key is specified, the application will automatically enter **Demo Mode** with local heuristic scanners so all features still function perfectly.)*
3. **Boot up the Development Server**:
   ```bash
   npm run dev
   ```
4. **Access the Application**:
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🎯 Live Demo Walkthrough Guide

### Step 1: Threat Analyzer (DETECT)
1. Navigate to the **Threat Analyzer** tab.
2. Under "Select Scenario Preset to Demo", click **Demat KYC Lock SMS (Phishing)**. Watch the text populate instantly.
3. Click **RUN SENTINEL SCAN**.
4. Review the **Threat Assessment Report**:
   * Risk Classification is flagged as **CRITICAL** with a score of 98/100.
   * Specific threat indicators (e.g., "Regulatory Impersonation", "Urgency Pressure") are highlighted.
   * Review the **Linguistic Stylometry** and **Immediate Protective Protocol** action plan.
5. Repeat with the **CEO Bonus Insider Audio (Voice Clone)** to see synthetic stylometry detection.

### Step 2: Cryptographic Stamp Generator (VERIFY)
1. Go to the **Communication Stamps** tab.
2. Under "Official Communication Stamp Generator", select **SEBI** as the issuer and type a reference ID.
3. Click **GENERATE DIGITAL STAMP**.
4. The system signs the text and generates a Base64 Cryptographic Stamp along with an interactive QR-code visualizer.
5. Click **COPY STAMP & TEXT TO CLIPBOARD** to lock the payload.

### Step 3: Stamp Verifier (VERIFY & TAMPER DEMO)
1. Scroll down to the **Real-Time Stamp Verifier** section.
2. Click **LOAD COPIED PAYLOAD** to paste the generated content and cryptographic seal.
3. Click **VERIFY AUTHENTICITY SEAL**. The system evaluates the hash and renders an **AUTHENTICITY SECURED** badge from a registered sender!
4. **Demonstrate Tampering**: Click the 🧪 **Simulate Tamper with Scam Link** button. This appends a malicious URL to the text.
5. Click **VERIFY AUTHENTICITY SEAL** again. The seal instantly turns red: **VERIFICATION FAILED (SIGNATURE MISMATCH / ALTERED CONTENT)**. This proves how SentinelAI prevents channel-jacking!

### Step 4: Investor Education (QUIZ)
1. Select the **Investor Education** tab.
2. Complete the interactive Securities Fraud IQ quiz to demonstrate our commitment to empowering retail and first-generation investors on social media.

---

## 📊 System Benchmarks
Explore the **System Benchmarks** tab to view empirical data comparing SentinelAI's detection latency and accuracy models across different attack vectors (Voice, Video, Text).
