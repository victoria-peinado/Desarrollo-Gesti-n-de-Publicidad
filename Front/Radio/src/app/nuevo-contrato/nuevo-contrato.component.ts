import { Component ,ViewChild, ElementRef } from '@angular/core';
import { MyDataService } from '../services/my-data.service';
import { OnInit } from '@angular/core';
import { take ,tap} from 'rxjs/operators';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core/index.js';
import { Validator } from '@angular/forms';
import { billingHolder } from '../models/billing-holder.js';
import { Trade } from '../models/trade.js';
@Component({
  selector: 'app-nuevo-contrato',
  templateUrl: './nuevo-contrato.component.html',
  styleUrls: ['./nuevo-contrato.component.scss']
})
export class NuevoContratoComponent implements OnInit {
  @ViewChild('inputBlock') inputBlock: any;
  @ViewChild('inputPrice', { static: false }) priceInputRef!: ElementRef;
  @ViewChild('inputCuit', { static: false }) cuitInputRef!: ElementRef;
  name: string | any = null;
  cuit: string|null = null;
  invalid: boolean = false;
  coloring: ThemePalette = "primary";
  holder: billingHolder|null= null;
  business: Trade|null = null;
  businesses: Trade[]| null = null;
  startDate: Date | null = null;
  endDate: Date | null = null;
  regDate: Date | null = null;
  notes: string | null = null;

  constructor(private myDataService: MyDataService, private router: Router) {}

  ngOnInit() {
    this.regDate = new Date();
  }

  redirectToHome() {
    this.router.navigate(['/']);
  }

  getHolder() {
    if (this.cuit != null) {
      this.myDataService.getBillingHolderByCUIT(this.cuit).subscribe({
        next: (result: any) => {
          if (result) {
            this.holder = result;
            this.getBusinesses();
          }
        },
        error: (error: any) => {
          //this.validHolder()
          // show backend error message
        }
      });
    }
  }

  getBusinesses() {
    this.myDataService.getTrades().pipe(take(1)).subscribe({
      next: (response: any) => {
      if (Array.isArray(response) && this.holder != null) {
        // The response object is already an array; no need to access the 'data' property.
        this.businesses = response;
      } else {
        console.error('La respuesta no es un arreglo.');
      }
    }});
  }

  getBusiness() {
    if (this.name != null) {
      this.myDataService.getTrades().pipe(take(1)).subscribe({
        next: (response: any) => {
        if (Array.isArray(response) && this.holder != null) {
          // The response object is already an array; no need to access the 'data' property.
          for (const bus of response) {
            if (bus.fantasyName === this.name && bus.billingHolderId === this.holder._id) {
              this.business = bus;
            }
          }
        } else {
          console.error('La respuesta no es un arreglo.');
        }
      }});
    }
  }

  validHolder() {
    // if (!this.holder) {
    //   // const cinput = this.cuitInputRef.nativeElement;
    //   // cinput.focus();
    //   this.coloring = "warn";
    // }
  }

  startDateValid() {
    if (this.startDate === null) {
      return false;
    } else {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const day = currentDate.getDate().toString().padStart(2, '0');
      const currentDateFormatted = `${year}-${month}-${day}`;
      const currentDate2 = new Date(currentDateFormatted);
      const startDateInput = new Date(this.startDate);

      return startDateInput >= currentDate2;
    }
  }

  endDateValid() {
    return this.endDate === null || (this.startDate !== null && this.endDate > this.startDate);
  }

  isCreateContractDisabled() {
    return !this.holder || !this.business || !this.endDateValid() || !this.startDateValid();
  }
}