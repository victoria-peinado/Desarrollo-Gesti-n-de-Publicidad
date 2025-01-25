import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-feedback-notification',
  templateUrl: './feedback-notification.component.html',
  styleUrls: ['./feedback-notification.component.scss']
})
export class FeedbackNotificationComponent {
  @Input() message: string = ''; // Mensaje a mostrar
  @Input() status: 'success' | 'error' = 'success'; // Estado de la notificación
  @Output() closeNotification = new EventEmitter<void>(); // Emisor de evento de cierre

  showNotification: boolean = false; // Control de visibilidad

  ngOnInit() {
    // Mostrar la notificación al inicio
    this.showNotification = true;

    // Cerrar automáticamente después de 5 segundos
    setTimeout(() => {
      this.hideNotification();
    }, 5000);
  }

  hideNotification() {
    this.showNotification = false;
    this.closeNotification.emit(); // Emitir evento de cierre
  }
}
