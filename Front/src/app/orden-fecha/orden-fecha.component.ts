import { Component ,ViewChild, ElementRef, ViewContainerRef} from '@angular/core';
import{OrdenBLoqueComponent} from '../orden-bloque/orden-bloque.component'

@Component({
  selector: 'app-orden-fecha',
  templateUrl: './orden-fecha.component.html',
 
})
export class OrdenFechaComponent {
 @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef
 createBlock(){
   this.container.createComponent(OrdenBLoqueComponent)
 }
}
