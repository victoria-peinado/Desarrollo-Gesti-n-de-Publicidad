import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSource = new BehaviorSubject<{
    message: string;
    status: 'success' | 'error';
  } | null>(null);
  currentNotification = this.notificationSource.asObservable();

  showNotification(message: string, status: 'success' | 'error') {
    this.notificationSource.next({ message, status });

    setTimeout(() => this.clearNotification(), 5000);
  }

  clearNotification() {
    this.notificationSource.next(null);
  }
}
