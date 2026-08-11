import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Notification, NotificationType } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private nextId = 0;

  private notifications = new Subject<Notification>();

  public $notifications: Observable<Notification> = this.notifications.asObservable();

  success(text: string): void {
    this.push('success', text);
  }

  error(text: string): void {
    this.push('error', text);
  }

  fromHttpError(error: unknown, fallback = "Something went wrong. Please try again."): void {
    this.error(this.describe(error, fallback));
  }

  private describe(error: unknown, fallback: string): string {
    if (!(error instanceof HttpErrorResponse)) {
      return fallback;
    }

    // Hugging Face reports failures as {"error": "..."}; keep `message` too so
    // any endpoint using the more conventional shape still reads correctly.
    const reported = error.error?.error ?? error.error?.message;
    if (typeof reported === "string" && reported.length) {
      return reported;
    }

    if (error.status === 0) {
      return "Could not reach the API. Check your connection and try again.";
    }

    return error.statusText ? `${error.status} ${error.statusText}` : fallback;
  }

  private push(type: NotificationType, text: string): void {
    this.notifications.next({ id: this.nextId++, type, text });
  }
}
