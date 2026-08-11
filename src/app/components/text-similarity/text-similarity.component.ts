import { Component } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {NotificationService} from "../../services/notification.service";

@Component({
    selector: 'app-text-similarity',
    templateUrl: './text-similarity.component.html',
    styleUrls: ['./text-similarity.component.css'],
    standalone: false
})
export class TextSimilarityComponent {
  public entityModel = {
    text1: "",
    text2: "",
  };
  public result: number | null = null;

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) { }

  onSubmit() {
    this.apiService.textSimilarity(this.entityModel.text1, this.entityModel.text2).subscribe({
      next: similarity => this.result = similarity,
      error: error => this.notificationService.fromHttpError(error)
    })
  }
}
