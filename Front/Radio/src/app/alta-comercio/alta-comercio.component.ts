import { Component, ViewChild, ElementRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core/index.js';
import { Router } from '@angular/router';
import { MyDataService } from 'src/app/services/my-data.service';
import { SharedDataService } from '../services/shared-data.service';
import { Owner } from '../models/owner.js';

@Component({
  selector: 'app-alta-comercio',
  templateUrl: './alta-comercio.component.html',
  styleUrls: ['./alta-comercio.component.scss'],
})
export class AltaComercioComponent {
  @ViewChild('cuitInput', { static: false }) cuitInputRef!: ElementRef;
  
  coloring: ThemePalette = 'primary';
  cuitInvalid: boolean = false;
  isButtonDisabled: boolean = true;
  cuit: string = '';
  message: string = '';

  constructor(
    private router: Router,
    private _ownerService: MyDataService,
    private sharedDataService: SharedDataService
  ) {}

  redirectToHome() {
    this.router.navigate(['/login']);
  }

  redirectToNuevoComercio() {
    this.router.navigate(['/altaComercio/nuevoComercio']);
  }
  

  onInput() {
    this.isButtonDisabled = !this.cuit;

    if (this.isButtonDisabled) {
      this.alertUserAboutError('*Este campo es <strong>obligatorio</strong>.');
    } else {
      this.cuitInvalid = false;
      this.coloring = 'primary';
    }
  }

  validateNumberInput(event: any) {
    const inputChar = String.fromCharCode(event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      event.preventDefault();
    }
  }

  alertUserAboutError(mess: string) {
    this.cuitInvalid = true;
    this.coloring = 'warn';
    this.message = mess;

    const cuitInputElement = this.cuitInputRef.nativeElement;
    cuitInputElement.click();
    cuitInputElement.focus();
  }

  verifyCuit() {
    this._ownerService.getOwnerByCuit(this.cuit).subscribe({
      next: (response: any) => {
        const owner: Owner = response.data;
        
        this.sharedDataService.setCuit(owner.cuit);
        this.sharedDataService.setBusinessName(owner.businessName);
        this.sharedDataService.setFiscalCondition(owner.fiscalCondition);
        this.redirectToNuevoComercio();
      },
      error: (error: any) => {
        console.error('Error: ', error);
        this.alertUserAboutError(
          'Cuit <strong>incorrecto</strong>. Por favor, ingrese un Cuit válido.'
        );
      }
    });
  }
}
