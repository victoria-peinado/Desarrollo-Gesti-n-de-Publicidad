import { Component } from '@angular/core';

@Component({
  selector: 'app-nuevo-comercio',
  templateUrl: './nuevo-comercio.component.html',
  styleUrls: ['./nuevo-comercio.component.scss']
})
export class NuevoComercioComponent {
  cuit: string = '11-11111111-1';
  razonSocial: string = "Juan Perez";
  condicionFinal: string = "Responsable inscripto"
}
