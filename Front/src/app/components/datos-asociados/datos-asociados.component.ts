import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-datos-asociados',
  templateUrl: './datos-asociados.component.html',
  styleUrls: ['./datos-asociados.component.scss']
})
export class DatosAsociadosComponent {
  @Input() datos: { atributo: string; valor?: string }[] = [];
  @Input() formularioValido = false;
}
