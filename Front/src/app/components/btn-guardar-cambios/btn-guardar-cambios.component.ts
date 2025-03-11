import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-btn-guardar-cambios',
  templateUrl: './btn-guardar-cambios.component.html',
  styleUrl: './btn-guardar-cambios.component.scss'
})
export class BtnGuardarCambiosComponent {
  @Input() disabled: boolean = false;
  @Input() text: string = 'Guardar Cambios';
  @Output() clickEvent: EventEmitter<void> = new EventEmitter();

  onClick() {
    if (!this.disabled) {
      this.clickEvent.emit();
    }
  }
  
}
