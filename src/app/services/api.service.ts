import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { environment } from "../../environments/environment";
import {
  Annotation,
  DetectedLanguage,
  HfClassification,
  HfEntity,
  Sentiment,
  SentimentType
} from '../models';

/**
 * Each capability is a different model on Hugging Face's serverless inference
 * API. They are addressed by name, so swapping a model is a one-line change.
 */
const MODELS = {
  entities: 'dslim/bert-base-NER',
  sentiment: 'distilbert/distilbert-base-uncased-finetuned-sst-2-english',
  language: 'papluca/xlm-roberta-base-language-detection',
  similarity: 'sentence-transformers/all-MiniLM-L6-v2'
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public token: string = "";

  private visible = new Subject<boolean>();

  public $visible = this.visible.asObservable();

  constructor(private http: HttpClient) {
    const localToken = localStorage.getItem("token");
    if (localToken != null) {
      this.token = localToken;
      this.visible.next(true);
    } else {
      this.visible.next(false);
    }
  }

  /**
   * Validates a token by doing the smallest possible real inference call.
   *
   * Checking the account endpoint instead would be cheaper, but any valid token
   * passes it — including a read-only one that cannot call inference at all.
   * That token would be accepted here and then fail with 403 on every feature,
   * so the check has to exercise the permission the app actually needs.
   */
  checkToken(token: string): Observable<unknown> {
    return this.http.post(
      `${environment.BASE_URL}/${MODELS.language}`,
      { inputs: "hello", parameters: { top_k: 1 } },
      { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) }
    );
  }

  setTokenValid(isValid: boolean): void {
    this.visible.next(isValid);
  }

  /**
   * Named entity recognition. The model scores every entity it finds; the
   * confidence floor is applied here since the API has no such parameter.
   */
  entityExtraction(text: string, minConf: number): Observable<Annotation[]> {
    return this.http.post<HfEntity[]>(
      `${environment.BASE_URL}/${MODELS.entities}`,
      { inputs: text, parameters: { aggregation_strategy: "simple" } },
      { headers: this.authHeaders() }
    ).pipe(
      map(entities => (entities ?? [])
        .filter(entity => entity.score >= minConf)
        .map(entity => ({
          label: entity.word,
          type: entity.entity_group,
          confidence: entity.score
        })))
    );
  }

  /** Cosine similarity between two texts, in [0, 1]. */
  textSimilarity(text1: string, text2: string): Observable<number> {
    return this.http.post<number[]>(
      `${environment.BASE_URL}/${MODELS.similarity}`,
      { inputs: { source_sentence: text1, sentences: [text2] } },
      { headers: this.authHeaders() }
    ).pipe(
      map(scores => scores?.[0] ?? 0)
    );
  }

  /** Detects the language, most confident first. */
  languageDetection(text: string): Observable<DetectedLanguage[]> {
    return this.http.post<HfClassification[] | HfClassification[][]>(
      `${environment.BASE_URL}/${MODELS.language}`,
      { inputs: text, parameters: { top_k: 5 } },
      { headers: this.authHeaders() }
    ).pipe(
      map(response => this.flatten(response).map(prediction => ({
        lang: prediction.label,
        confidence: prediction.score
      })))
    );
  }

  /**
   * The model returns a probability per label (POSITIVE / NEGATIVE). Collapse
   * that into one signed score so the UI keeps its red-to-green gradient.
   */
  sentimentAnalysis(text: string): Observable<Sentiment> {
    return this.http.post<HfClassification[] | HfClassification[][]>(
      `${environment.BASE_URL}/${MODELS.sentiment}`,
      { inputs: text },
      { headers: this.authHeaders() }
    ).pipe(
      map(response => this.toSentiment(this.flatten(response)))
    );
  }

  private toSentiment(predictions: HfClassification[]): Sentiment {
    const scoreFor = (label: string) =>
      predictions.find(p => p.label.toUpperCase() === label)?.score ?? 0;

    const score = scoreFor('POSITIVE') - scoreFor('NEGATIVE');

    let type: SentimentType = 'neutral';
    if (score > 0.25) {
      type = 'positive';
    } else if (score < -0.25) {
      type = 'negative';
    }

    return { score: Math.round(score * 100) / 100, type };
  }

  /** Classification results arrive either flat or wrapped in an extra array. */
  private flatten(response: HfClassification[] | HfClassification[][]): HfClassification[] {
    if (!Array.isArray(response)) {
      return [];
    }
    return Array.isArray(response[0])
      ? (response[0] as HfClassification[])
      : (response as HfClassification[]);
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  }
}
