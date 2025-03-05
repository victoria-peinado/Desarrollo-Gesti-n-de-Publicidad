import { Directive, Input, OnInit, OnDestroy, ViewContainerRef, TemplateRef } from '@angular/core';
import { MyDataService } from '../services/my-data.service';

@Directive({
  selector: '[appShowForRoles]',
  standalone: true
})
export class ShowForRolesDirective implements OnInit {
  @Input() appShowForRoles: string[] = []; // Lista de roles permitidos

  constructor(
    private myDataService: MyDataService,
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}

  ngOnInit(): void {
    // Obtenemos el valor de getUserRole() directamente
    const userRole = this.myDataService.getUserRole();
    console.log(userRole);

    // Si el rol del usuario está en la lista de roles permitidos, mostramos el contenido
    if (userRole && this.appShowForRoles.includes(userRole)) {
      this.viewContainerRef.createEmbeddedView(this.templateRef); // Mostrar el contenido
    } else {
      this.viewContainerRef.clear(); // Ocultar el contenido
    }
  }

  ngOnDestroy(): void {
    // No es necesario limpiar suscripciones, ya que no usamos observables
  }
}