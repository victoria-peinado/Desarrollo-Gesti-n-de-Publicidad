import { Component, ViewChild, ElementRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core/index.js';
import { Router } from '@angular/router';
import { MyDataService } from 'src/app/services/my-data.service';
import { SharedDataService } from '../services/shared-data.service';

@Component({
  selector: 'app-alta-comercio',
  templateUrl: './alta-comercio.component.html',
  styleUrls: ['./alta-comercio.component.scss'],
})
export class AltaComercioComponent {
  @ViewChild('cuitInput', { static: false }) cuitInputRef!: ElementRef;
  cuit: string = '';
  cuitInvalid: boolean = false;
  coloring: ThemePalette = 'primary';

  constructor(
    private router: Router,
    private _BillingHolderService: MyDataService,
    private sharedDataService: SharedDataService
  ) {}

  redirectToHome() {
    this.router.navigate(['/login']);
  }

  redirectToNuevoComercio() {
    this.router.navigate(['/altaComercio/nuevoComercio']);
  }

  verifyCuit() {
    console.log(typeof this._BillingHolderService.getBillingHolderByCUIT(this.cuit))
    this._BillingHolderService.getBillingHolderByCUIT(this.cuit).subscribe(
      (result: any) => {
        if (result) {
          this.cuitInvalid = false;
          this.sharedDataService.setCuit(result.CUIT);
          this.sharedDataService.setRazonSocial(result.businessName);
          this.sharedDataService.setCondicionFinal(result.fiscalCondition);
          this.redirectToNuevoComercio();
        } else {
          this.cuitInvalid = true;
          this.coloring = 'warn';

          const cuitInputElement = this.cuitInputRef.nativeElement;
          cuitInputElement.click();
          cuitInputElement.focus();
        }
      },
      (error: any) => {
        console.error(error);
        this.cuitInvalid = true;
        this.coloring = 'warn';

        const cuitInputElement = this.cuitInputRef.nativeElement;
        cuitInputElement.click();
        cuitInputElement.focus();
      }
    );
  }
}
