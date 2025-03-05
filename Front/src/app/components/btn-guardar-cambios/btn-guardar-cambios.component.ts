import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-btn-guardar-cambios',
  templateUrl: './btn-guardar-cambios.component.html',
  styleUrl: './btn-guardar-cambios.component.scss'
})
export class BtnGuardarCambiosComponent {

  @Input() disabled: boolean = false;
  @Input() text: string = 'Guardar Cambios';

}
