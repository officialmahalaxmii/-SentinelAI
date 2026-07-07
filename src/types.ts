export interface VerifiedIdentity {
  id: string;
  name: string;
  domain: string;
  category: "Regulator" | "Exchange" | "Listed Company" | "Intermediary";
  officialContact: string;
}

export interface AnalysisResponse {
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  riskScore: number;
  syntheticConfidence: number;
  phishingConfidence: number;
  detectedIndicators: string[];
  keyFindings: string[];
  linguisticAnalysis: string;
  actionPlan: string[];
}

export interface DigitalStamp {
  institutionId: string;
  institutionName: string;
  domain: string;
  subject: string;
  timestamp: string;
  referenceId: string;
  contentHash: string;
  signature: string;
}

export interface VerificationResult {
  valid: boolean;
  reason?: "UNKNOWN_SENDER_ID" | "CONTENT_TAMPERED" | "SIGNATURE_FORGED";
  message: string;
  metadata?: {
    institution?: VerifiedIdentity;
    timestamp: string;
    referenceId: string;
    hash?: string;
    stampHash?: string;
    actualHash?: string;
  };
}

export interface Scenario {
  id: string;
  title: string;
  type: "email_sms" | "media_transcript";
  claimedSender: string;
  channelClaim: string;
  content: string;
  isLegitimate: boolean;
  institutionId?: string; // If legitimate, which one
  expectedRisk: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  description: string;
}
