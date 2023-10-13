import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-btn-degrade',
  templateUrl: './btn-degrade.component.html',
  styleUrls: ['./btn-degrade.component.scss']
})
export class BtnDegradeComponent {
   @Input() text: string = 'Aceptar';

}
