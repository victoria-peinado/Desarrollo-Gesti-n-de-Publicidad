import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-feedback-notification',
  templateUrl: './feedback-notification.component.html',
  styleUrls: ['./feedback-notification.component.scss'],
})
export class FeedbackNotificationComponent implements OnInit {
  message: string = '';
  status: 'success' | 'error' = 'success';
  showNotification: boolean = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.currentNotification.subscribe((notification) => {
      if (notification) {
        this.message = notification.message;
        this.status = notification.status;
        this.showNotification = true;

        setTimeout(() => this.hideNotification(), 5000);
      }
    });
  }

  hideNotification() {
    this.showNotification = false;
  }
}
