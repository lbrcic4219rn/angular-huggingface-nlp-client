import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: false
})
export class HomeComponent implements OnInit {
  public token: string = "";
  public localToken: string = "";

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    const localTkn = localStorage.getItem('token')
    if (localTkn != null) {
      this.apiService.setTokenValid(true)
      this.localToken = localTkn;
    } else this.apiService.setTokenValid(false);
  }

  onSubmit (): void {
    this.apiService.checkToken(this.token).subscribe({
      next: () => {
        this.apiService.setTokenValid(true);
        localStorage.setItem('token', this.token);
        this.apiService.token = this.token;
        this.localToken = this.token;
        this.token = "";
        this.notificationService.success("Token saved. The analysis tools are unlocked.");
      },
      error: error => this.handleTokenError(error)
    })
  }

  /**
   * A 403 here means the token is real but lacks the inference permission,
   * which is the most common setup mistake. Say what to do about it rather
   * than relaying the API's wording, which does not mention the fix.
   */
  private handleTokenError(error: unknown): void {
    if (error instanceof HttpErrorResponse && error.status === 403) {
      this.notificationService.error(
        'This token cannot call Inference Providers. Create a fine-grained token ' +
        'with the "Make calls to Inference Providers" permission, then try again.'
      );
      return;
    }

    this.notificationService.fromHttpError(error, "That token was not accepted.");
  }

}
