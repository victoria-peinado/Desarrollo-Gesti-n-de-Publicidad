import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Shop } from 'src/app/models/shop';
import { MyDataService } from 'src/app/services/my-data.service';
import { Order } from 'src/app/models/order';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { USUAL_PAYMENT_FORMS } from 'src/app/constants/constants';
import { data } from 'cypress/types/jquery/index.js';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-registro-pago-category',
  templateUrl: './registro-pago-category.component.html',
  styleUrl: './registro-pago-category.component.scss'
})
export class RegistroPagoCategoryComponent {
  @ViewChild('of') ownerNgForm: NgForm | undefined;
  paymentForms: string[] = USUAL_PAYMENT_FORMS;

  owner_form: FormGroup;
  order_form: FormGroup;
    shops: any[] = [];
    errorMessageOwner: string | null = null;
    cuit: string = '';
    comercios: string[] = [];
    ownerFounded: boolean = false;
    nextStep: boolean = false;

    orders = [];

    
    
    columnDefs = [
      { key: 'index', label: 'N°' },
      { key: 'id', label: 'Id' },
      {key:'regDate', label: 'F. Reg.'},
      { key:'totalAds', label: 'Cant. Publi.' },
      { key:'totalCost', label: 'Costo total' },
      {key :'obs', label: 'Obs.'},
      {key:'showName', label: 'Nombre del show'},
      {key:'liq', label: 'Liquidado'},
      {key:'month', label: 'Mes'},
      {key:'cancelDate', label: 'Fecha de cancelación'},

     

    ];
  
  ordersDetailed: {id: number, regDate: string, totalAds: number,  totalCost: number, obs: string, showName: string, liq: boolean, month: string, cancelDate: string}[] = [];
  dateTo: Date | null = null;
  dateFrom: Date | null = null;
  obs: string = '';
  id: string = '';
    
    constructor(public dialog: MatDialog, private myDataService: MyDataService, private _snackBar: SnackbarService, private sharedDataService: SharedDataService) {
      this.owner_form = new FormGroup({
        cuit: new FormControl('', [
          Validators.required,
          Validators.maxLength(11),
          Validators.minLength(11),
          Validators.pattern(/^[0-9]+$/),
          sharedDataService.verifyCuit()
        ]),
        comercio: new FormControl(
          { value: '', disabled: true }
        ),
      });

      this.order_form = new FormGroup({
        dateFrom: new FormControl('', Validators.required),
        dateTo: new FormControl('',Validators.required),
        obs: new FormControl('',Validators.required),
      });
    }

    
    
    
    






    clearForm(form: NgForm | undefined, values: any) {
        form?.resetForm(values);
      }
  
    findOwner() {
  
  
      this.cuit = this.cuitControl.value.trim();
  
      if(!this.cuit) return;
  
      this.myDataService.getOwnerByCuit(this.cuit).subscribe({
        next: (response: any) => {
          this.ownerFounded = true;
          this.shops = response.data.shops;
          this.errorMessageOwner = null;
          this.comercios = response.data.shops.map(
            (shop: Shop) => shop.fantasyName
          );
          this.comercioControl.enable();
          this.clearForm(this.ownerNgForm, {
            cuit: this.cuitControl.value,
            comercio: ''
          });
        },
        error: () => {
          this.ownerFounded = false;
          this.shops = [];
          this.comercioControl.disable();
          this.errorMessageOwner = 'Titular inexistente.';
        },
      });
    }
  
    next() {
      
      this.nextStep = true;
      if (this.cuit&&!this.comercioControl.value) {
        console.log('cuit');
        this.myDataService.getOrdersByOwnerCuit(this.cuit).subscribe({
          next: (response: any) => {
            this.orders = response.data;
            this.ordersDetailed = this.orders.map((order: any, index: number) => ({
              id: order.id,
              index: index + 1,
              regDate: order.regDate,
              totalAds: order.totalAds,
              totalCost: order.totalCost,
              obs: order.obs,
              showName: order.showName,
              liq: order.liq,
              month: order.month,
              cancelDate: order.cancelDate,
            }));
            this._snackBar.openSnackBar(response.message, 'success-snackbar');
          },
          
          error: (error) => {
            let errorMessage = error.error.errors ? error.error.errors || error.error.messages: error.error.messages;
            this._snackBar.openSnackBar(errorMessage, 'unsuccess-snackbar');
          }
        
      });}
      if (this.cuit&&this.comercioControl.value) {
        console.log('shp');
       
        const selectedShop = this.shops.find(shop => shop.fantasyName === this.comercioControl.value);
        console.log(selectedShop);
        this.myDataService.getOrdersByShopId(selectedShop.id).subscribe({
          next: (response: any) => {
            this.orders = response.data;
            this.ordersDetailed = this.orders.map((order: any, index: number) => ({
              id: order.id,
              index: index + 1,
              regDate: order.regDate,
              totalAds: order.totalAds,
              totalCost: order.totalCost,
              obs: order.obs,
              showName: order.showName,
              liq: order.liq,
              month: order.month,
              cancelDate: order.cancelDate,
            }));
            this._snackBar.openSnackBar(response.message, 'success-snackbar');
          },
          
          error: (error) => {
            let errorMessage = error.error.errors ? error.error.errors || error.error.messages: error.error.messages;
            this._snackBar.openSnackBar(errorMessage, 'unsuccess-snackbar');
          }
        
      });}
      if (!this.cuit) {
        console.log('all');
       const startOfYear = new Date(new Date().getFullYear(), 0, 1);
      const startOfNextYear = new Date(new Date().getFullYear() + 1, 0, 1);

      const startOfYearString = `${startOfYear.getFullYear()}-${startOfYear.getMonth() + 1}-${startOfYear.getDate()}`;
      const startOfNextYearString = `${startOfNextYear.getFullYear()}-${startOfNextYear.getMonth() + 1}-${startOfNextYear.getDate()}`;
        this.myDataService.getOrdersByDates('2025-1-1','2026-1-1').subscribe({
          next: (response: any) => {
            console.log(response);
            this.orders = response.data;
            this.ordersDetailed = this.orders.map((order: any, index: number) => ({
              id: order.id,
              index: index + 1,
              regDate: order.regDate,
              totalAds: order.totalAds,
              totalDays: order.totalDays,
              totalCost: order.totalCost,
              obs: order.obs,
              showName: order.showName,
              liq: order.liq,
              month: order.month,
              cancelDate: order.cancelDate,
            }));
             this._snackBar.openSnackBar(response.message, 'success-snackbar');
          },
          
          error: (error) => {
            let errorMessage = error.error.errors ? error.error.errors || error.error.messages: error.error.messages;
            this._snackBar.openSnackBar(errorMessage, 'unsuccess-snackbar');
          }
        
      });}
    }

    onRowSelected(row: any) {
      // this.dateFrom = row.dateFrom;
      // this.dateTo = row.dateTo;
      // this.obs = row.obs;
      this.id = row.id;
      
      // this.dateFromControl.setValue(row.dateFrom);
      // this.dateToControl.setValue(row.dateTo);
      // this.obsControl.setValue(row.obs);

    }
  
    get cuitControl(): FormControl {
      return this.owner_form.get('cuit') as FormControl;
    }
  
    get comercioControl(): FormControl {
      return this.owner_form.get('comercio') as FormControl;
    }

    get dateFromControl(): FormControl {
      return this.order_form.get('dateFrom') as FormControl;
    }
  
    get dateToControl(): FormControl {
      return this.order_form.get('dateTo') as FormControl;
    }

    get obsControl(): FormControl {
      return this.order_form.get('obs') as FormControl;
    }

     formatDateToYYYYMMDD(date: Date | string): string | undefined {
      if (!date) return undefined;
    
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0'); // sumamos 1 porque los meses empiezan en 0
      const day = String(d.getDate()).padStart(2, '0');
    
      return `${year}-${month}-${day}`;
    }
     save() {
     
//       {
//         "paymentDate":"2025-2-26",
//         "paymentForm":"Efectivo",
//         "paymentObs":"Seguimos con problemas de horas"
// } 
      const data = { paymentDate : this.formatDateToYYYYMMDD(this.dateFromControl.value),
                      paymentForm: this.dateToControl.value,
                      paymentObs: this.obsControl.value
                    };
      this.myDataService.payOrder(this.id,data).subscribe({
        next: (response: any) => {
          this._snackBar.openSnackBar(response.message, 'success-snackbar');
        },
        error: (error: any) => {
          console.log(error);
          let errorMessage = error.error.errors ? error.error.errors || error.error.messages: error.error.messages;
          this._snackBar.openSnackBar(errorMessage, 'unsuccess-snackbar');
        },
      });
    }
    //  save() {
    //       const contract = new Contract(this.id, this.formatDateToYYYYMMDD(this.dateToControl.value), this.obsControl.value);
    //       console.log(contract);
    //       this.myDataService.patchContract(contract).subscribe({
       
    //         next: (response: any) => {
    //             this._snackBar.openSnackBar(response.message, 'success-snackbar');
    //           },
    //           error: (error: any) => {
    //             console.log(error);
    //             let errorMessage = error.error.errors ? error.error.errors || error.error.messages: error.error.messages;
    //             this._snackBar.openSnackBar(errorMessage, 'unsuccess-snackbar');
    //           },
    //       });
    //     }

    openDialog() {
      
    }
}
