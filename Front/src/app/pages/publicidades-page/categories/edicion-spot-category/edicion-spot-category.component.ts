import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MyDataService } from 'src/app/services/my-data.service';
import { Order } from 'src/app/models/order';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { USUAL_PAYMENT_FORMS } from 'src/app/constants/constants';
import { data } from 'cypress/types/jquery/index.js';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { Shop } from 'src/app/models/shop';

@Component({
  selector: 'app-edicion-spot-category',
  templateUrl: './edicion-spot-category.component.html',
  styleUrl: './edicion-spot-category.component.scss'
})
export class EdicionSpotCategoryComponent {

  audioFile: File | null = null;
  audioURL: string | null = null;
  duracionSpot: string = 'Calculando...';
  spot_form: FormGroup;
  animal: string = '';
  name: string = '';

  spotId: string = '';
  cargando: boolean = false;

  orderFounded: boolean = false;

  orderId: string = '';
  contractId: string = '';
  fantasyName: string = '';
  businessName: string = '';

  spotURL: string = '';
  errorMessage: string | null = null;

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
    
    ordersDetailed: {id: number, regDate: string, totalAds: number,  totalCost: number, obs: string, showName: string, liq: boolean, month: string, cancelDate: string, spot: string}[] = [];
    dateTo: Date | null = null;
    dateFrom: Date | null = null;
    obs: string = '';
    id: string = '';
    spot: string = '';

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
    this.spot_form = new FormGroup({
      spot: new FormControl('', Validators.required),
    });
  }




  // publicidades-edición-spot-page.component.ts
  siguiente() {

    if (!this.orderId) return;

    this.cargando = true;
    this.myDataService.getOrderById(this.orderId).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.orderFounded = true;
          this.errorMessage = null;
          const contractId = response.data.contract;

          this.myDataService.getContractById(contractId).subscribe({
            next: (contractResponse: any) => {
              if (contractResponse && contractResponse.data) {
                const shop = contractResponse.data.shop;
                const ownerId = shop.owner;

                this.myDataService.getOwnerById(ownerId).subscribe({
                  next: (ownerResponse: any) => {
                    if (ownerResponse && ownerResponse.data) {
                      this.contractId = contractId;
                      this.fantasyName = shop.fantasyName;
                      this.businessName = ownerResponse.data.businessName;
                    }
                    this.cargando = false;
                  },
                  error: () => {
                    this.errorMessage =
                      'Error al obtener datos del dueño del comercio.';
                    this.cargando = false;
                  },
                });
              }
            },
            error: () => {
              this.errorMessage = 'Error al obtener datos del contrato.';
              this.cargando = false;
            },
          });
        } else {
          this.orderFounded = false;
          this.errorMessage = 'Orden no encontrada.';
          this.cargando = false;
        }
      },
      error: () => {
        this.orderFounded = false;
        this.errorMessage = 'Orden no encontrada.';
        this.cargando = false;
      },
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.audioFile = input.files[0];
      this.audioURL = URL.createObjectURL(this.audioFile);
      this.spot_form.get('spot')?.setValue(this.audioFile.name);
      this.spot_form.updateValueAndValidity();
      this.calcularDuracion(this.audioURL);
    }
  }

  calcularDuracion(audioSrc: string) {
    const audio = new Audio(audioSrc);
    audio.addEventListener('loadedmetadata', () => {
      const minutos = Math.floor(audio.duration / 60);
      const segundos = Math.floor(audio.duration % 60);
      this.duracionSpot = `${minutos}:${segundos
        .toString()
        .padStart(2, '0')} seg`;
    });
  }
  updateOrder() {
    console.log('updateorder')
    this.getSpotId()
      .pipe(
        switchMap((spotId) => {
          this.spotId = spotId;

          const orderData: any = {
              spot: this.spotId,
          };

          console.log('holaaaaaaaaaaaaaaaaaaaaaaaaaa')
          console.log(orderData);

          return this.myDataService.patchOrderSpot(this.orderId, orderData);
        })
      )
      .subscribe({
        next: (response: any) => {
          this._snackBar.openSnackBar(response.message, 'success-snackbar');
          //this.clearAllForm();
        },
        error: (error: any) => {
          let errorMessage = error.error.errors ? error.error.errors || error.error.messages: error.error.messages;
          console.log(error);
          this._snackBar.openSnackBar(errorMessage, 'unsuccess-snackbar');
        },
      });
  }

  getSpotId(): Observable<string> {
  
        if(this.audioFile) {
        return this.myDataService.uploadAudio(this.audioFile).pipe(
          map((response: any) => {
            this.spotId = response.data.spot.id;
            console.log('Spot creado:', this.spotId);
            return this.spotId;
          }),
          catchError((error) => {
            console.error('Error creating spot:', error);
            return throwError(() => new Error('Failed to create spot'));
          })
        );
      }
     else {
      return of(this.spotId);
    }
    }
  

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        text: `<p>¿Seguro que desea actualizar el Spot de la Orden <strong>${this.orderId}</strong>?</p>`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.updateOrder();
    });
  }

  // registro pago copy

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
                spot: order.spot
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
                spot: order.spot
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
                spot: order.spot
              }));
               this._snackBar.openSnackBar(response.message, 'success-snackbar');
            },
            
            error: (error) => {
              let errorMessage = error.error.errors ? error.error.errors || error.error.messages: error.error.messages;
              this._snackBar.openSnackBar(errorMessage, 'unsuccess-snackbar');
            }
          
        });}
      }
  
      getSpot(spotId: string) {
        this.myDataService.getSpotById(spotId).subscribe({
          next: (response: any) => {
            this.spot = response.data;
            this.spotURL = response.data.url;
          },
          error: (error) => {
            let errorMessage = error.error.errors ? error.error.errors || error.error.messages: error.error.messages;
            this._snackBar.openSnackBar(errorMessage, 'unsuccess-snackbar');
          }
        })
      }
      onRowSelected(row: any) {
        this.id = row.id;
        this.orderId = row.id;
        console.log(this.orderId)

        this.getSpot(row.spot);
  
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
  
}
