import { Component, ViewChild, ElementRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core/index.js';
import { Router } from '@angular/router';
import { MyDataService } from 'src/app/services/my-data.service';

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

  constructor(private router: Router, private _BillingHolderService: MyDataService,) { }

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
    this._BillingHolderService.getBillingHolderByCUIT(this.cuit).subscribe(
      (result: any) => {
        if (result) {
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
      },
      (error: any) => {
        console.error(error);
        this.cuitInvalid = true;
        this.coloring = "warn";
        this.icon = "";
  
        const cuitInputElement = this.cuitInputRef.nativeElement;
        cuitInputElement.click();
        cuitInputElement.focus();
      }
    );
  }
  
  
  

}
