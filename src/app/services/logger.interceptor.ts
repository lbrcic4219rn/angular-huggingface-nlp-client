import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import {HistoryService} from "./history.service";

@Injectable()
export class LoggerInterceptor implements HttpInterceptor {

  constructor(private historyService: HistoryService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.historyService.add({
      timestamp: new Date(),
      method: request.method,
      endpoint: this.redactToken(request.urlWithParams)
    });
    return next.handle(request);
  }

  /**
   * The API token travels in the Authorization header, which is never logged.
   * This stays as a safeguard in case an endpoint ever takes it in the query
   * string, since the history is rendered in the UI.
   */
  private redactToken(url: string): string {
    return url.replace(/([?&]token=)[^&]*/gi, "$1***");
  }
}
