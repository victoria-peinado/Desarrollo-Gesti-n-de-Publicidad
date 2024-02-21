import { Component ,ViewChild, ElementRef } from '@angular/core';
import { MyDataService } from '../services/my-data.service';
import { OnInit } from '@angular/core';
import { take ,tap} from 'rxjs/operators';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core/index.js';
import { Validator } from '@angular/forms';
import { Owner } from '../models/owner.js';
import { Shop } from '../models/shop.js';
@Component({
  selector: 'app-nuevo-contrato',
  templateUrl: './nuevo-contrato.component.html',
  styleUrls: ['./nuevo-contrato.component.scss']
})
export class NuevoContratoComponent implements OnInit {
  @ViewChild('inputBlock') inputBlock: any;
  @ViewChild('inputPrice', { static: false }) priceInputRef!: ElementRef;
  @ViewChild('inputCuit', { static: false }) cuitInputRef!: ElementRef;
  name: string | null  = null;
  cuit: string|null = null;
  invalid: boolean = false;
  coloring: ThemePalette = "primary";
  holder: Owner|null= null;
  business: Shop|null = null;
  businesses: Shop[]= [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  regDate: Date | null = null;
  notes: string | null = null;

  constructor(private myDataService: MyDataService, private router: Router) {}

  ngOnInit() {
    this.regDate = new Date();//esto lo deberia hacer una funcion create
  }

  getHolder() {
    this.businesses = []; 
    this.business=null;
    this.holder=null;
    if (this.cuit != null) {
      this.myDataService.getOwnerByCuit(this.cuit).subscribe({
        next: (result: any) => {
          if (result) {
            this.holder = result;
            this.getBusinesses();
          }
        },
        error: (error: any) => {

        }
      });
    }
  }


  getBusinesses() {

      this.myDataService.getShops().pipe(take(1)).subscribe({
        next: (response: any) => {
        if (Array.isArray(response.data) && this.holder != null) {
          // The response object is already an array; no need to access the 'data' property.
          for (const bus of response.data) {
            if ( bus.OwnerId === this.holder.id) {
              this.businesses.push(bus);
            }
          }
        } 
        else {
          console.error('La respuesta no es un arreglo.');
        }
      }});
    
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

  focusNext(next: any): void {
    setTimeout(() => {
      
      next.focus();
    });
  }

  isCreateContractDisabled() {
    return !this.holder || !this.business || !this.endDateValid() || !this.startDateValid();
  }
}