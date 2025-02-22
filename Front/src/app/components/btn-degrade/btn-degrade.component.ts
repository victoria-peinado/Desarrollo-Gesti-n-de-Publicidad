import { Component, Input } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-btn-degrade',
  templateUrl: './btn-degrade.component.html',
  styleUrls: ['./btn-degrade.component.scss']
})
export class BtnDegradeComponent {
  @Input() text: string = 'Aceptar';
  @Input() disabled: boolean = false;
}
