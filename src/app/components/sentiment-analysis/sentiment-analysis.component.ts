import { Component } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {NotificationService} from "../../services/notification.service";
import {Sentiment} from "../../models";

@Component({
    selector: 'app-sentiment-analysis',
    templateUrl: './sentiment-analysis.component.html',
    styleUrls: ['./sentiment-analysis.component.css'],
    standalone: false
})
export class SentimentAnalysisComponent {

  public entityModel = {
    text: ""
  };

  public sentiment: Sentiment | null = null;

  private colorRed = { r: 255, g: 0, b: 0 };
  private colorGreen = { r: 0, g: 255, b: 0 };

  public sentimentColor = { r: 0, g: 0, b: 0 };

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) { }

  onSubmit() {
    this.apiService.sentimentAnalysis(this.entityModel.text).subscribe({
      next: sentiment => {
        this.sentiment = sentiment;
        this.sentimentColor = this.toColor(sentiment.score);
      },
      error: error => this.notificationService.fromHttpError(error)
    });
  }

  /** Blends red to green across the [-1, 1] score range. */
  private toColor(score: number) {
    const t = this.normalizeValue(score);
    return {
      r: this.colorRed.r + (this.colorGreen.r - this.colorRed.r) * t,
      g: this.colorRed.g + (this.colorGreen.g - this.colorRed.g) * t,
      b: this.colorRed.b + (this.colorGreen.b - this.colorRed.b) * t,
    };
  }

  normalizeValue(value: number): number {
    return (value - -1) / (1 - -1);
  }
}
