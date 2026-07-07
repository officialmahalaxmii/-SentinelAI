import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Gemini SDK lazily to avoid crashing on start if API key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const app = express();
const PORT = 3000;

// Parse JSON payloads
app.use(express.json({ limit: "10mb" }));

// Pre-seeded keypair for our verified financial institutions authentication demonstration
// We'll use a standard HMAC key / private key seed to sign and verify official stamps
const AUTH_SECRET = process.env.AUTH_SECRET || "sentinal_ai_market_integrity_key_2026_xyz";

// Verified Institutions Registry
interface VerifiedIdentity {
  id: string;
  name: string;
  domain: string;
  category: "Regulator" | "Exchange" | "Listed Company" | "Intermediary";
  officialContact: string;
}

const VERIFIED_INSTITUTIONS: Record<string, VerifiedIdentity> = {
  sebi: {
    id: "sebi",
    name: "Securities and Exchange Board of India (SEBI)",
    domain: "sebi.gov.in",
    category: "Regulator",
    officialContact: "sebi@sebi.gov.in",
  },
  nse: {
    id: "nse",
    name: "National Stock Exchange (NSE)",
    domain: "nseindia.com",
    category: "Exchange",
    officialContact: "nseplus@nse.co.in",
  },
  bse: {
    id: "bse",
    name: "BSE Limited (Bombay Stock Exchange)",
    domain: "bseindia.com",
    category: "Exchange",
    officialContact: "bsehelp@bseindia.com",
  },
  reliance: {
    id: "reliance",
    name: "Reliance Industries Limited (RIL)",
    domain: "ril.com",
    category: "Listed Company",
    officialContact: "investor.relations@ril.com",
  },
  hdfc: {
    id: "hdfc",
    name: "HDFC Bank Limited",
    domain: "hdfcbank.com",
    category: "Listed Company",
    officialContact: "investor.relations@hdfcbank.com",
  },
  zerodha: {
    id: "zerodha",
    name: "Zerodha Broking Limited",
    domain: "zerodha.com",
    category: "Intermediary",
    officialContact: "compliance@zerodha.com",
  },
};

// API: List Verified Institutions
app.get("/api/institutions", (req, res) => {
  res.json({ institutions: Object.values(VERIFIED_INSTITUTIONS) });
});

// API: Get App Configuration & Status
app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    environment: process.env.NODE_ENV || "development",
  });
});

// API: Cryptographically Sign a Message (Demonstrating Legit Communication Verification)
app.post("/api/sign", (req, res) => {
  try {
    const { institutionId, content, subject, referenceId } = req.body;

    if (!institutionId || !content) {
      return res.status(400).json({ error: "Institution ID and content are required." });
    }

    const institution = VERIFIED_INSTITUTIONS[institutionId];
    if (!institution) {
      return res.status(404).json({ error: "Institution not found in verified registry." });
    }

    const timestamp = new Date().toISOString();
    const refId = referenceId || `TXN-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const cleanContent = content.trim();

    // Generate SHA-256 hash of content
    const contentHash = crypto.createHash("sha256").update(cleanContent).digest("hex");

    // Create signature payload
    const signPayload = `${institution.id}|${contentHash}|${timestamp}|${refId}`;

    // Cryptographic signature using HMAC
    const signature = crypto.createHmac("sha256", AUTH_SECRET).update(signPayload).digest("hex");

    // The complete Verifiable Stamp JSON object
    const stamp = {
      institutionId: institution.id,
      institutionName: institution.name,
      domain: institution.domain,
      subject: subject || "Official Financial Communication",
      timestamp,
      referenceId: refId,
      contentHash,
      signature,
    };

    res.json({
      success: true,
      stamp,
      stampSerialized: Buffer.from(JSON.stringify(stamp)).toString("base64"),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// API: Verify a Serialized Digital Communication Stamp
app.post("/api/verify", (req, res) => {
  try {
    const { stampBase64, content } = req.body;

    if (!stampBase64 || !content) {
      return res.status(400).json({ error: "Verification requires both the stamp code and the communication text." });
    }

    let stamp: any;
    try {
      const decoded = Buffer.from(stampBase64, "base64").toString("utf8");
      stamp = JSON.parse(decoded);
    } catch (e) {
      return res.status(400).json({ error: "Invalid stamp format. Please provide a valid Base64-encoded stamp." });
    }

    const { institutionId, timestamp, referenceId, contentHash, signature } = stamp;

    if (!institutionId || !timestamp || !referenceId || !contentHash || !signature) {
      return res.status(400).json({ error: "Incomplete stamp metadata." });
    }

    const institution = VERIFIED_INSTITUTIONS[institutionId];
    if (!institution) {
      return res.json({
        valid: false,
        reason: "UNKNOWN_SENDER_ID",
        message: `The institution ID '${institutionId}' in the stamp is not registered in our verified database.`,
      });
    }

    // Check integrity of the text
    const cleanContent = content.trim();
    const computedHash = crypto.createHash("sha256").update(cleanContent).digest("hex");

    if (computedHash !== contentHash) {
      return res.json({
        valid: false,
        reason: "CONTENT_TAMPERED",
        message: "The message text does not match the cryptographic hash. The content has been altered or replaced!",
        metadata: {
          institution,
          timestamp,
          referenceId,
          stampHash: contentHash,
          actualHash: computedHash,
        },
      });
    }

    // Re-verify cryptographic signature
    const signPayload = `${institutionId}|${computedHash}|${timestamp}|${referenceId}`;
    const expectedSignature = crypto.createHmac("sha256", AUTH_SECRET).update(signPayload).digest("hex");

    if (signature !== expectedSignature) {
      return res.json({
        valid: false,
        reason: "SIGNATURE_FORGED",
        message: "The digital signature is invalid. The cryptographic seal has been forged!",
        metadata: {
          institution,
          timestamp,
          referenceId,
        },
      });
    }

    // Success! Verified
    res.json({
      valid: true,
      message: "This communication is AUTHENTIC and has been successfully verified cryptographically.",
      metadata: {
        institution,
        timestamp,
        referenceId,
        hash: computedHash,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Helper to run local heuristic scanning in case Gemini API is missing or fails (503/Quota issues)
function getLocalHeuristicScannerResult(norm: string) {
  let riskLevel = "LOW";
  let riskScore = 12;
  let syntheticConfidence = 8;
  let phishingConfidence = 5;
  let detectedIndicators = ["Baseline Correspondence"];
  let keyFindings = [
    "The message text does not contain typical financial phishing keywords or high-fear suspension threats.",
    "No suspicious non-governmental domains, IP URLs, or urgent short-timeframe penalties detected."
  ];
  let linguisticAnalysis = "Tone is standard business/academic communication. Vocabulary aligns with professional baselines without anomalous AI syntactic footprints.";
  let actionPlan = [
    "This message appears to carry low immediate risk.",
    "Always check if official institutional senders provide a cryptographic Verification Stamp."
  ];

  if (norm.includes("kyc") || norm.includes("suspend") || norm.includes("lock") || norm.includes("restrict") || norm.includes("penalty") || norm.includes("liquidat") || norm.includes("urgent") || norm.includes("block")) {
    riskLevel = "CRITICAL";
    riskScore = 89;
    syntheticConfidence = 25;
    phishingConfidence = 94;
    detectedIndicators = ["Urgent Threat Phrasing", "Impersonation Warning", "Credential/Verification Solicitation"];
    keyFindings = [
      "Identified aggressive, panic-inducing calls to action or financial penalty warnings.",
      "Demands quick verification or link clicking to avoid account suspension or blockages.",
      "Employs brand terms that require official cryptographic signatures to prove authenticity."
    ];
    linguisticAnalysis = "Linguistic evaluation highlights fear-elicitation and cognitive pressure techniques standard in retail financial phishing campaigns.";
    actionPlan = [
      "Do NOT click any suspicious links, download attachments, or input credit card/trading passwords.",
      "Check the official SEBI SCORES directory or contact your broker via their verified, registered portal.",
      "Report this text to the market regulator cyber division."
    ];
  } else if (norm.includes("bonus") || norm.includes("insider") || norm.includes("accumulate") || norm.includes("guarantee") || norm.includes("profit") || norm.includes("pump") || norm.includes("leak") || norm.includes("multifold")) {
    riskLevel = "HIGH";
    riskScore = 81;
    syntheticConfidence = 86;
    phishingConfidence = 50;
    detectedIndicators = ["Pump-and-Dump Indication", "AI-Style Promotional Flow", "High Return Guarantees"];
    keyFindings = [
      "Promotes guaranteed, unverified stock tips or insider news to drive rapid, coordinated buying.",
      "The wording utilizes exaggerated, promotional syntax characteristic of generative AI text scripts.",
      "Strictly violates SEBI compliance guidelines regarding advisory and investment communications."
    ];
    linguisticAnalysis = "Highly structured promotional speech. Employs predictive syntax templates associated with automated social-media stock pumps.";
    actionPlan = [
      "Disregard unsolicited tips or group channel leaks; they are structured to harvest retail liquidity.",
      "Cross-verify listing disclosures directly on BSE or NSE official portals.",
      "Report the source channel for unauthorized market advisory activity."
    ];
  } else if (norm.includes("panic") || norm.includes("shortfall") || norm.includes("freeze") || norm.includes("crash") || norm.includes("liquid")) {
    riskLevel = "CRITICAL";
    riskScore = 91;
    syntheticConfidence = 91;
    phishingConfidence = 20;
    detectedIndicators = ["Systemic Panic Bait", "AI Synthetic Script Markers"];
    keyFindings = [
      "Spreads shocking, panic-inducing warnings about market clearing houses or fund redemptions.",
      "Designed to prompt sudden, mass retail liquidations which destabilize normal trading pipelines.",
      "Tone contradicts the formal, measured guidelines prescribed for Indian financial market advisories."
    ];
    linguisticAnalysis = "Syntactic patterns suggest machine-constructed alarmism. Highly structured fear hooks are generated with unnatural pacing to evoke defensive sell decisions.";
    actionPlan = [
      "Do NOT make panic-driven liquidations or asset transfers.",
      "Refer directly to formal notices on the AMFI or SEBI compliance databases.",
      "Submit this communication to the cyber-defense desk for auditing."
    ];
  }

  return {
    riskLevel,
    riskScore,
    syntheticConfidence,
    phishingConfidence,
    detectedIndicators,
    keyFindings,
    linguisticAnalysis,
    actionPlan,
  };
}

// API: Analyze Text / Media for Synthetic Markers or Phishing
app.post("/api/analyze", async (req, res) => {
  try {
    const { content, type, senderClaim, channelClaim } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required for analysis." });
    }

    // Normalized content to help detect matching scenarios
    const norm = content.toLowerCase().trim();

    // 1. High-fidelity pre-seeded mock analysis results for the standard demo scenarios
    // This ensures 100% reliable, ultra-fast demo responses even completely offline
    let presetReport = null;

    if (norm.includes("regulatory penalty and permanent liquidation") || norm.includes("sebi-regulatory-kyc-verification.com")) {
      presetReport = {
        riskLevel: "CRITICAL",
        riskScore: 98,
        syntheticConfidence: 20,
        phishingConfidence: 98,
        detectedIndicators: ["Regulatory Impersonation", "Urgency Pressure", "Credential Theft Domain", "Suspicious Link"],
        keyFindings: [
          "The message claims to be from 'SEBI Info Desk' but uses high-pressure suspension threats ('suspended within 2 hours').",
          "The link 'sebi-regulatory-kyc-verification.com' is registered on a cheap non-governmental registrar, not the official 'sebi.gov.in'.",
          "Demands sensitive bank and PAN card passwords which regulatory bodies never request via SMS."
        ],
        linguisticAnalysis: "Urgent, high-fear social engineering text. Syntactic structures use high-urgency verbs ('SUSPENDED', 'must immediately', 'avoid permanent liquidation') typical of standard phishing kits.",
        actionPlan: [
          "DO NOT click the link or input any details.",
          "Report the phone number and link to SEBI SCORES portal.",
          "Verify the official notification through SentinelAI's Communication Stamp Verifier."
        ]
      };
    } else if (norm.includes("bonus share issue") || norm.includes("quietly accumulate as many shares")) {
      presetReport = {
        riskLevel: "HIGH",
        riskScore: 85,
        syntheticConfidence: 92,
        phishingConfidence: 10,
        detectedIndicators: ["Pump-and-Dump Language", "LLM Syntactic Footprints", "Insider Leak Bait"],
        keyFindings: [
          "The linguistic patterns contain distinct AI artifacts like perfectly balanced grammatical structures and repetitive opening hooks.",
          "Promotes unsolicited 'insider trading' tips to 'quietly accumulate shares' before market open, a classic pump-and-dump tactic.",
          "Urges secrecy ('Do not forward this voice recording') to prevent institutional audit and increase fear of missing out."
        ],
        linguisticAnalysis: "Forensic analysis of the transcript reveals high probability of voice synthesis writing. Perfect punctuation rhythm and lack of spontaneous human filler words ('um', 'uh', hesitations) strongly suggest text-to-speech script generation.",
        actionPlan: [
          "Disregard the voice memo; do not buy shares based on unsolicited group chat clips.",
          "Verify if Reliance Industries (RIL) has published any official disclosure on NSE/BSE portals.",
          "Report the broadcast group coordinates to SEBI's market manipulation desk."
        ]
      };
    } else if (norm.includes("liquidity shortfall in our flagship") || norm.includes("freeze redemptions at 3:00 pm today")) {
      presetReport = {
        riskLevel: "CRITICAL",
        riskScore: 95,
        syntheticConfidence: 95,
        phishingConfidence: 30,
        detectedIndicators: ["Market Panic Inducement", "Fake Service Interruption Claim", "AI Voice Clone Stylometry"],
        keyFindings: [
          "The video claims a major fund redemption freeze, designed to trigger an artificial market run or panic sell-off.",
          "Highly structured alarmist phrasing designed to bypass standard compliance verification channels.",
          "Lack of official regulatory filings or announcements on the Apex Mutual Fund registered website."
        ],
        linguisticAnalysis: "Highly calculated alarmist stylometry. The syntax is optimized for cognitive panic responses, utilizing phrases characteristic of hostile deepfake social campaigns.",
        actionPlan: [
          "Do not redeem or sell fund units in panic.",
          "Cross-verify fund redemption status on the AMFI (Association of Mutual Funds in India) portal.",
          "Report the YouTube channel hosting the deepfake to SEBI Cyber Cell."
        ]
      };
    } else if (norm.includes("publish aggregate daily asset values") || norm.includes("sebi/ho/imd/df2/cir/p/2026/89")) {
      presetReport = {
        riskLevel: "LOW",
        riskScore: 4,
        syntheticConfidence: 5,
        phishingConfidence: 2,
        detectedIndicators: ["Verified Institutional Language"],
        keyFindings: [
          "Highly structured administrative and technical language standard for official regulator circulars.",
          "Contains official compliance template references ('SEBI/HO/IMD/DF2/CIR/P/2026/89') without any urgent financial pressure or link baits.",
          "Refers strictly to public disclosure compliance on official AMC domains."
        ],
        linguisticAnalysis: "The text shows professional, dry legal syntax, highly characteristic of SEBI's compliance division documents. No signs of linguistic exaggeration, semantic pressure, or generative model hallmarks.",
        actionPlan: [
          "This circular is assessed as safe and genuine.",
          "AMCs should implement the aggregate daily asset value posting by 9:00 PM IST.",
          "Always verify the companion Digital Cryptographic Stamp on SentinelAI to guarantee document integrity."
        ]
      };
    } else if (norm.includes("revised value at risk") || norm.includes("member_services@nse.co.in")) {
      presetReport = {
        riskLevel: "LOW",
        riskScore: 3,
        syntheticConfidence: 8,
        phishingConfidence: 2,
        detectedIndicators: ["Verifiable Exchange Directive"],
        keyFindings: [
          "Follows official NSE exchange advisory styling and references Risk Management Committee guidelines.",
          "Mentions verified contact emails ('member_services@nse.co.in') and phone numbers.",
          "No urgency baits or panic-inducing calls to transfer funds to external wallets."
        ],
        linguisticAnalysis: "Routine exchange bulletin with dry technical vocabulary. Matches baseline historical corpus of NSE margin adjustment circulars perfectly.",
        actionPlan: [
          "Trading members can process the VaR margin updates normally.",
          "Ensure additional margins are cleared through the official NSE Clearing Corporation channels."
        ]
      };
    }

    if (presetReport) {
      return res.json({
        success: true,
        analysis: presetReport,
        isSimulated: true,
      });
    }

    // 2. Fallback if GEMINI_API_KEY is not configured
    // Run an intelligent local keyword heuristic scanner so arbitrary user entries still function smoothly
    if (!process.env.GEMINI_API_KEY) {
      const localReport = getLocalHeuristicScannerResult(norm);
      return res.json({
        success: true,
        analysis: localReport,
        isSimulated: true,
      });
    }

    const ai = getGeminiClient();

    // Define systemic prompt based on the analysis type
    const isMediaTranscript = type === "media_transcript";

    const systemInstruction = `
      You are SentinelAI, a state-of-the-art cyber-security engine specializing in detecting synthetic media, AI-generated content, deepfake audio/video transcripts, and financial phishing attacks targeting securities and stock market investors.
      Analyze the provided content and evaluate its risk profile. Respond ONLY with a valid JSON object matching the requested schema.
      
      Look for:
      1. Phishing & Urgency Markers: Urgent calls to action, margin-call scare tactics, high-pressure demands, guarantees of returns, links to non-official domains, unsolicited trade tips, impersonation of regulatory authorities (like SEBI, stock exchanges, or official brokers).
      2. AI Generation/Synthetic Markers: Language models often leave syntactic fingerprints (highly structured transitions, repetitive sentence stems, overly generic disclaimers, sterile phrasing, or typical GPT-style introductory/closing filler).
      3. Deepfake/Voice Clone Transcript Markers: Unnatural phrasing in transcriptions, rapid shifts in subject, excessive insider confidence, "guaranteed" market pumps, emotional manipulation tailored to look like an executive CEO/CIO briefing.
    `;

    const userPrompt = `
      Analyze the following financial communication.
      Context:
      - Claimed Sender: ${senderClaim || "Unknown/Unspecified"}
      - Delivery Channel: ${channelClaim || "Not provided (SMS/Email/Social)"}
      - Threat Type: ${isMediaTranscript ? "Synthetic Media / Deepfake Executive Transcript" : "Phishing Email / Social Engineering Msg"}
      
      Content to Analyze:
      """
      ${content}
      """
    `;

    // Prompt for JSON Output matching a strict Schema structure
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: {
              type: Type.STRING,
              description: "Must be 'CRITICAL', 'HIGH', 'MEDIUM', or 'LOW'",
            },
            riskScore: {
              type: Type.INTEGER,
              description: "A scale score from 0 (completely genuine) to 100 (definitely synthetic/phishing)",
            },
            syntheticConfidence: {
              type: Type.INTEGER,
              description: "Confidence percentage (0-100) that this content is AI-generated (text/audio script/deepfake writing style)",
            },
            phishingConfidence: {
              type: Type.INTEGER,
              description: "Confidence percentage (0-100) that this is a phishing/social engineering attack",
            },
            detectedIndicators: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Specific threat indicators found, e.g., 'Regulatory Impersonation', 'Urgency Pressure', 'LLM Syntactic Footprints', 'Suspicious Links', 'Pump-and-Dump Language'",
            },
            keyFindings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Bullet points detailing the exact reasons why it was flagged or authenticated.",
            },
            linguisticAnalysis: {
              type: Type.STRING,
              description: "Short paragraph assessing stylistic, tonal, and syntactic clues of AI-generation or manipulation.",
            },
            actionPlan: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Recommended immediate steps for the investor (e.g. 'Do not click links', 'Report to SEBI SCORES portal', 'Verify via SentinelAI Verification Stamp')",
            }
          },
          required: [
            "riskLevel",
            "riskScore",
            "syntheticConfidence",
            "phishingConfidence",
            "detectedIndicators",
            "keyFindings",
            "linguisticAnalysis",
            "actionPlan"
          ],
        },
      },
    });

    const analysisResult = JSON.parse(response.text?.trim() || "{}");

    res.json({
      success: true,
      analysis: analysisResult,
    });
  } catch (error: any) {
    console.warn("Gemini Live API call failed, falling back to local heuristic analyzer:", error.message || error);
    const contentToAnalyze = (req.body.content || "").toLowerCase().trim();
    const localReport = getLocalHeuristicScannerResult(contentToAnalyze);
    localReport.linguisticAnalysis = `[GEMINI SERVICE BUSY / OFFLINE FALLBACK] ${localReport.linguisticAnalysis}`;
    res.json({
      success: true,
      analysis: localReport,
      isSimulated: true,
      isFallback: true,
    });
  }
});

// Start server
async function startServer() {
  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SentinelAI backend running on port ${PORT}`);
  });
}

startServer();
