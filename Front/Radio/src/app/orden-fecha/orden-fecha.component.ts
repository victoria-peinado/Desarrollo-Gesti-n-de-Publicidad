import { Component ,ViewChild, ElementRef, ViewContainerRef} from '@angular/core';
import{OrdenBLoqueComponent} from '../orden-bloque/orden-bloque.component'

@Component({
  selector: 'app-orden-fecha',
  templateUrl: './orden-fecha.component.html',
  styleUrls: ['./orden-fecha.component.scss']
})
export class OrdenFechaComponent {
 @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef
 crearBloque(){
   this.container.createComponent(OrdenBLoqueComponent)
 }
}
