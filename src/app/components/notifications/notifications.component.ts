import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Notification } from '../../models';
import { NotificationService } from '../../services/notification.service';

const DISMISS_AFTER_MS = 6000;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  standalone: false
})
export class NotificationsComponent implements OnInit, OnDestroy {
  public notifications: Notification[] = [];

  private subscription = new Subscription();
  private timers = new Map<number, ReturnType<typeof setTimeout>>();

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.subscription.add(
      this.notificationService.$notifications.subscribe(notification => {
        this.notifications.push(notification);
        this.timers.set(
          notification.id,
          setTimeout(() => this.dismiss(notification.id), DISMISS_AFTER_MS)
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
  }

  dismiss(id: number): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this.notifications = this.notifications.filter(notification => notification.id !== id);
  }
}
