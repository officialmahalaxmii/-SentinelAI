# SentinelAI: Prototype Scope, Simulation Disclosures & Production Roadmap

This document outlines the differences between the current **working hackathon prototype** of SentinelAI and its target **enterprise-grade production deployment**, ensuring absolute honesty and structural transparency for the hackathon jury and technical audits.

---

## 1. Threat Analyzer (DETECT)

### 🔴 Prototype Simulation
* **Audio and Video Processing**: The prototype parses transcripts and metadata rather than analyzing raw binary audio files (WAV/MP3) or video frames (MP4).
* **AI Scoring**: In the absence of a Gemini API key or internet connection, threat assessments are handled by a local heuristic matching engine that maps standard fraud patterns (urgency, panic, unverified stock pumps) to simulated detailed JSON reports.
* **Accuracy Statistics**: Benchmark charts and statistics rendered in the "System Benchmarks" tab reflect target performance models calibrated on baseline historical datasets rather than live telemetry from production clusters.

### 🟢 Production Deployment Roadmap
* **Biometric & Waveform Classifiers**: Deep learning audio models (e.g., voice-clone spectral analyzers) will evaluate raw audio to detect synthetic artifacts like vocoder residue and phase anomalies.
* **Video Deepfake Frame Auditing**: Frame-by-frame convolutional networks will detect temporal inconsistencies in lip sync, ear/nose alignment, and facial blending borders.
* **On-Device Edge Models**: Lightweight, quantized threat-detection models will run locally inside brokerage apps (Kite, Groww) to minimize user latency and preserve data privacy.

---

## 2. Communication Stamps (VERIFY)

### 🔴 Prototype Simulation
* **Private Key Management**: HMAC-SHA256 signing keys are stored in a standard server configuration file rather than hardware vaults.
* **Signature Scope**: The HMAC secret is shared server-wide for demonstration convenience, rather than using distinct public-private keypairs managed on decentralised infrastructure.
* **Identity Registration**: Senders are pre-seeded in the database for instant lookup.

### 🟢 Production Deployment Roadmap
* **Hardware Security Modules (HSMs)**: All institutional private keys will be provisioned in Federal Information Processing Standards (FIPS) 140-2 Level 3 HSM vaults.
* **Asymmetric Public-Key Infrastructure (PKI)**: Senders will sign official documents using an asymmetric standard (e.g., ECDSA over Curve25519). The public keys will be stored on a distributed ledger (like SEBI's regulatory chain) to prevent single-point-of-compromise.
* **Universal Registry Lookup**: A secure DNS-over-HTTPS or public certificate registry will allow any brokerage terminal or mobile chat client to verify stamps in less than 50ms.

---

## 3. Operational Integrity & Security

### 🔴 Prototype Simulation
* **Authentication**: There is no user authentication (OAuth/IAM) implemented for the stamp creation dashboard.
* **Audit Logging**: Successful validations are logged in transient server memory.

### 🟢 Production Deployment Roadmap
* **OAuth2 + SEBI IAM**: Access to the Digital Stamp Generator will require multi-factor hardware keys bound to official SEBI, NSE, or BSE personnel credentials.
* **Durable Verification Ledger**: All stamp verifications and blocked incidents will write to a security information and event management (SIEM) pipeline for forensic reporting.
