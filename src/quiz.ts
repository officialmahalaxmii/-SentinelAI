export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  contextType: "Voice Clone" | "Deepfake Video" | "Phishing SMS" | "Pump-and-Dump";
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    contextType: "Voice Clone",
    question: "You receive a forwarded WhatsApp audio note where a voice sounding exactly like your stockbroker's CIO urges you to 'immediately buy shares of XYZ' before an unannounced takeover. What is the safest action?",
    options: [
      "Buy the shares immediately to capitalize on the early leak.",
      "Forward the audio note to your friends to help them make a profit.",
      "Ignore it entirely, or verify by calling the official broker helpline listed on their registered SEBI portal.",
      "Check the stock price on a public chart and if it is rising, buy immediately."
    ],
    correctAnswerIndex: 2,
    explanation: "AI voice clones can replicate any executive or advisor's voice in seconds with under 3 seconds of reference audio. Never trust unsolicited voice tip clips on chat apps. Always cross-verify through verified, official, and independent contact points."
  },
  {
    id: 2,
    contextType: "Phishing SMS",
    question: "An SMS claiming to be from 'SEBI Info Desk' warns that your demat account is frozen and demands you upload your PAN card and bank password to 'sebi-verification-portal.net'. How can you spot this as a scam?",
    options: [
      "The domain '.net' and name 'sebi-verification-portal.net' are not the official government domain (sebi.gov.in).",
      "The SMS uses high-urgency language demanding action within a brief time window (e.g., 'within 2 hours').",
      "It requests sensitive personal information like bank credentials or trading passwords, which regulators never ask for.",
      "All of the above."
    ],
    correctAnswerIndex: 3,
    explanation: "Scammers use domain names that mimic official entities, create false urgency ('within 2 hours'), and request credentials or private keys. Official regulators will ONLY correspond through verified .gov.in domains and never demand trading passwords."
  },
  {
    id: 3,
    contextType: "Deepfake Video",
    question: "You see a video of a famous listed company's CEO on YouTube looking slightly rigid but speaking clearly, claiming that the company is filing for sudden bankruptcy. You notice the lip-sync is slightly off. What is the likely cause?",
    options: [
      "Bad YouTube connection or slow video rendering speed on your phone.",
      "A high-quality generative AI deepfake video designed to manipulate stock price (short-selling manipulation).",
      "The CEO was speaking in a different language and the video was dubbed by professional actors.",
      "The CEO was in a rush and forgot how to speak clearly."
    ],
    correctAnswerIndex: 1,
    explanation: "Deepfake videos often target high-profile executives to cause panic stock sales, allowing attackers to benefit from short-selling or panic. Key tells include rigid facial postures, unnatural blinking patterns, minor lip-sync latency, and high-shock claims contradicting official stock exchange announcements."
  },
  {
    id: 4,
    contextType: "Pump-and-Dump",
    question: "An AI-generated social media account on Twitter, posing as an institutional stock research firm with a blue checkmark, posts a chart showing a 'guaranteed 400% return' on a penny stock within 5 days. What is the mechanic behind this?",
    options: [
      "It is a genuine insider scoop that the public has not seen yet.",
      "It is a synthetic social media pump-and-dump scheme designed to trap retail liquidity, allowing scammers to sell their pre-bought shares at high prices.",
      "The research firm has built a supercomputer that can predict the exact future of the stock.",
      "The stock is backed by regulatory guarantees."
    ],
    correctAnswerIndex: 1,
    explanation: "Synthetic social media profiles powered by LLMs are used to generate thousands of fake positive reviews, charts, and testimonials to orchestrate retail 'pumps'. Once retail investors pile in, the creators dump their shares, causing a catastrophic price crash."
  }
];
