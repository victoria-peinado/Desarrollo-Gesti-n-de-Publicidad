import { Component, ViewChild, ElementRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core/index.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alta-comercio',
  templateUrl: './alta-comercio.component.html',
  styleUrls: ['./alta-comercio.component.scss']
})
export class AltaComercioComponent {
  @ViewChild('cuitInput', { static: false }) cuitInputRef!: ElementRef;
  cuit: string = '';
  cuitInvalid: boolean = false;
  cuitsPermitidos: string[] = ['11111111111']; // simulación BD
  coloring: ThemePalette = "primary";
  icon: string = 'display: none';

  constructor(private router: Router) { }

  redirectToHome() {
    this.router.navigate(['/']);
  }

  redirectToNuevoComercio() {
    this.router.navigate(['/altaComercio/nuevoComercio']);
  }

  isCuitValid(): boolean {
    return this.cuitsPermitidos.includes(this.cuit);
  }

  verifyCuit() {
    if (this.isCuitValid()) {
      this.cuitInvalid = false;
      this.redirectToNuevoComercio();
    } else {
      this.cuitInvalid = true;
      this.coloring = "warn";
      this.icon = "";
  
      const cuitInputElement = this.cuitInputRef.nativeElement;
      cuitInputElement.click();
      cuitInputElement.focus();
    }
  }
  

}
