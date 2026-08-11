/** A named entity found in the submitted text. */
export interface Annotation {
  /** The surface form as it appears in the text, e.g. "Angular". */
  label: string;
  /** Entity type reported by the model: PER, ORG, LOC or MISC. */
  type: string;
  confidence: number;
}

export interface DetectedLanguage {
  lang: string;
  confidence: number;
}

export type SentimentType = 'positive' | 'negative' | 'neutral';

export interface Sentiment {
  /** Signed score in [-1, 1]: negative is unhappy, positive is happy. */
  score: number;
  type: SentimentType;
}

export interface Log {
  timestamp: Date;
  method: string;
  endpoint: string;
}

export type NotificationType = 'success' | 'error';

export interface Notification {
  id: number;
  type: NotificationType;
  text: string;
}

/* ---------- Raw Hugging Face inference responses ---------- */

/** token-classification, with aggregation_strategy=simple. */
export interface HfEntity {
  entity_group: string;
  word: string;
  score: number;
}

/** text-classification: one label with its probability. */
export interface HfClassification {
  label: string;
  score: number;
}
