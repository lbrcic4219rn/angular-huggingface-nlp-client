import { Component } from '@angular/core';
import {DetectedLanguage} from "../../models";
import {ApiService} from "../../services/api.service";
import {NotificationService} from "../../services/notification.service";

@Component({
    selector: 'app-language-detection',
    templateUrl: './language-detection.component.html',
    styleUrls: ['./language-detection.component.css'],
    standalone: false
})
export class LanguageDetectionComponent {
  entityModel = {
    text: ""
  };
  detectedLanguages: DetectedLanguage[] = [];

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) { }

  onSubmit() {
    this.apiService.languageDetection(this.entityModel.text).subscribe({
      next: languages => this.detectedLanguages = languages,
      error: error => this.notificationService.fromHttpError(error)
    })
  }
}
