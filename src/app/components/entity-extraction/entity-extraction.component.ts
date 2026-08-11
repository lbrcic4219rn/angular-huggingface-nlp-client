import { Component } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {Annotation} from "../../models";
import {NotificationService} from "../../services/notification.service";

@Component({
    selector: 'app-entity-extraction',
    templateUrl: './entity-extraction.component.html',
    styleUrls: ['./entity-extraction.component.css'],
    standalone: false
})
export class EntityExtractionComponent {
  public entityModel = {
    text: "",
    minConf: 0
  }
  public annotations: Annotation[] = [];
  public submitted = false;

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) { }

  setMinConf(value: string){
    this.entityModel.minConf = parseFloat(value);
  }

  /** Colours the badge by entity type: person, organisation, location, other. */
  badgeClass(type: string): string {
    switch (type) {
      case 'PER': return 'bg-primary';
      case 'ORG': return 'bg-success';
      case 'LOC': return 'bg-warning text-dark';
      default: return 'bg-secondary';
    }
  }

  onSubmit() {
    this.apiService.entityExtraction(this.entityModel.text, this.entityModel.minConf).subscribe({
      next: annotations => {
        this.annotations = annotations;
        this.submitted = true;
      },
      error: error => this.notificationService.fromHttpError(error)
    })
  }
}
