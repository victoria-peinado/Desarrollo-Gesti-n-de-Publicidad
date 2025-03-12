import { Component, signal, ViewChild } from '@angular/core';
import {
  Form,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Shop } from 'src/app/models/shop';
import { MyDataService } from 'src/app/services/my-data.service';
import { Contract } from 'src/app/models/contract';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Spot } from 'src/app/models/spot';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { Order } from 'src/app/models/order.js';
import { addMonths, format } from 'date-fns';
import { SharedDataService } from 'src/app/services/shared-data.service';


@Component({
  selector: 'app-emision-ordenes-category',
  templateUrl: './emision-ordenes-category.component.html',
  styleUrl: './emision-ordenes-category.component.scss',
})
export class EmisionOrdenesCategoryComponent {
  @ViewChild('of') ownerNgForm: NgForm | undefined;

  owner_form: FormGroup;
  contract_form: FormGroup;
  order_form: FormGroup;
  audioFile: File | null = null;
  audioURL: string | null = null;
  spot: Spot | null = null;
  duracionSpot: string = 'Calculando...';
  spot_form: FormGroup;
  shops: any[] = [];
  errorMessageOwner: string | null = null;
  cuit: string = '';
  comercios: string[] = [];
  ownerFounded: boolean = false;
  completeOrdenData: boolean = false;
  nextStep: boolean = false;
  spotId: string = '';
  contractId: string = '';
  regStructureIsEmpty: boolean = true;
  validsNextYearMonths: string[] = []

  contracts = [];

  contractsDetailed: {
    id: number;
    dateFrom: string;
    dateTo: string;
    regDate: string;
    obs: string;
  }[] = [];

  columnDefs = [
    { key: 'index', label: 'N°' },
    { key: 'dateFrom', label: 'Fecha Desde' },
    { key: 'dateTo', label: 'Fecha Hasta' },
    { key: 'regDate', label: 'Fecha Realización' },
    { key: 'obs', label: 'Observaciones' },
    { key: 'id', label: 'Id' },
  ];
  dateTo: Date | null = null;
  dateFrom: Date | null = null;
  obs: string = '';
  id: string = '';

  createdSpotId: string = '';
  orderData: any = {};
  regStructure: { [key: string]: string[] } = {};
  notRegularStructure: [string, string[]][] = [];
  isNotRegular: boolean = false;
  isNRSignal = signal(false);

  dobsEmitidos: boolean = false
  structureIsEmpty: boolean = true;


  constructor(
    public dialog: MatDialog,
    private myDataService: MyDataService,
    private _snackBar: SnackbarService,
    private sharedDataService: SharedDataService
  ) {
    this.cargarProximosDoceMeses()

    this.owner_form = new FormGroup({
      cuit: new FormControl('', [
        Validators.required,
        Validators.maxLength(11),
        Validators.minLength(11),
        Validators.pattern(/^[0-9]+$/),
        sharedDataService.verifyCuit()
      ]),
      comercio: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
    });

    this.contract_form = new FormGroup({
      dateFrom: new FormControl({ value: '', disabled: true }),
      dateTo: new FormControl(''),
      obs: new FormControl(''),
    });

    this.order_form = new FormGroup({
      nameStrategy: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]), // Nombre Campaña
      showName: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]), // Nombre Programa
      obs: new FormControl(''),
      month: new FormControl('', [
        Validators.required
      ])
    });

    this.spot_form = new FormGroup({
      name: new FormControl('', Validators.required),
      long: new FormControl('', Validators.required),
      //path: new FormControl('', Validators.required),
    });
  }

  captureRegStructure(structure: { [key: string]: string[] }) {
    console.log('Estructura recibida:', structure);
    this.regStructure = structure;
    this.structureIsEmpty = this.isStructureEmphty();
  }

  caputreNotRegularStruc(structure: [string, string[]][]) {
    console.log('Estructura recibida:', structure);
    this.notRegularStructure = structure;
    this.structureIsEmpty = this.isStructureEmphty();
  }

  isStructureEmphty(){
     if (this.isNotRegular){
       //si la orden es no regular
       if (this.notRegularStructure.length>0){
         return false
       } else { return true}
     } else {
      //la orden es regular
      const keys = Object.keys(this.regStructure)
       const programedKeys = ['monday', 'tuesday',  'wednesday', 'thursday',  'friday', 'saturday', 'sunday']
      if (keys == programedKeys){
        //la estructura regular esta cargada
        let band = false 
        for (const k of keys){
          if (this.regStructure[k].length>1){band = true} }
        return band
      } else {
        return false
      }
     }
   }

  captureIsNotRegular(isNoRegular: boolean){
    this.isNotRegular = isNoRegular
    this.isNRSignal.set(isNoRegular)
  }

  captureDatosEmitidos(band: boolean){
    this.dobsEmitidos = band
  }

  setContract(contractId: string) {
    this.contractId = contractId;
  }

  /*createOrder() {

        this.orderData = {
          nameStrategy: this.nameStrategyControl.value,
          obs: this.obsOrderControl.value,
          showName: this.showNameControl.value,
          contract: this.contractId,
          spot: this.spotId,
          regular: true,
          regStructure: this.regStructure,
        };

        console.log('Creando orden con datos:', this.orderData);

        this.myDataService.createOrder(this.orderData).subscribe({
          next: (response: any) => {
            this._snackBar.openSnackBar(response.message, 'success-snackbar');
          },
          error: (error: any) => {
            let errorMessage = error.error.errors
              ? error.error.errors || error.error.messages
              : error.error.messages;
            this._snackBar.openSnackBar(errorMessage, 'unsuccess-snackbar');
          },
        });

  }*/

createOrder() {
      this.getSpotId()
        .pipe(
          switchMap((spotId) => {
            this.spotId = spotId;
  
            if(!this.isNotRegular){
        this.orderData = {
          nameStrategy: this.order_form.get('nameStrategy')?.value, // Personalizar según necesidad
          obs: this.order_form.get('obs')?.value,
          showName: this.order_form.get('showName')?.value,
          month: this.order_form.get('month')?.value,
          contract: this.contractId, // ID de la contratación seleccionada
          spot: this.spotId, // ID del spot recién creado
          regular: true,
          regStructure: this.regStructure, // La estructura de bloques seleccionados
        }}  else{
          //la orden es no regular
          console.log('VAMOS A CREAR UNA ORDEN NO REGULAR!!')
          this.orderData = {
            nameStrategy: this.order_form.get('nameStrategy')?.value, // Personalizar según necesidad
            obs: this.order_form.get('obs')?.value,
            showName: this.order_form.get('showName')?.value,
            month: this.order_form.get('month')?.value,
            contract: this.contractId, // ID de la contratación seleccionada
            spot: this.spotId, // ID del spot recién creado
            regular: false,
            notRegStructure: this.notRegularStructure, // La estructura de bloques seleccionados
        }}
  
            console.log(this.orderData);
  
            return this.myDataService.createOrder(this.orderData);
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

  /*
    onUpload(): void {
      if (this.audioFile) {
          this.myDataService.uploadAudio(this.audioFile).subscribe({
              next: (response) => {
                this._snackBar.openSnackBar(response.message, 'success-snackbar');
                this.spot = response.data.spot;
                this.spotId = response.data.spot.id;
                console.log('Spot creado:', response);
              },
             error: (error: any) => {
              console.log(error);
              let errorMessage = error.error.errors
                ? error.error.errors || error.error.messages
                : error.error.messages;
              this._snackBar.openSnackBar(errorMessage, 'unsuccess-snackbar');
            },
          });
      } else {
          console.warn('No audio file selected');
      }
  }*/

  clearForm(form: NgForm | undefined, values: any) {
    form?.resetForm(values);
  }

  findOwner() {
    this.cuit = this.cuitControl.value.trim();

    if (!this.cuit) return;

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
          comercio: '',
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

  scroll(htmlElement: string, point: ScrollLogicalPosition | undefined) {
    setTimeout(() => {
      const element = document.getElementById(htmlElement);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: point });
      }
    }, 100);
  }

  next() {
    this.nextStep = true;
    this.scroll('datos-contratacion', 'end');

    const selectedShop = this.shops.find(
      (shop) => shop.fantasyName === this.comercioControl.value
    );
    if (selectedShop) {
      this.myDataService.getContractsByShopId(selectedShop.id).subscribe({
        next: (response: any) => {
          this.contracts = response.data;
          this.contractsDetailed = this.contracts.map(
            (contract: any, index: number) => ({
              id: contract.id,
              index: index + 1,
              dateFrom: contract.dateFrom,
              dateTo: contract.dateTo,
              regDate: contract.regDate,
              obs: contract.observations,
            })
          );
        },

        error: () => {},
      });
    }
  }

  onRowSelected(row: any) {
    this.completeOrdenData = true;
    this.scroll('datos-orden', 'start');
    this.contractId = row.id;
  }

  get cuitControl(): FormControl {
    return this.owner_form.get('cuit') as FormControl;
  }

  get comercioControl(): FormControl {
    return this.owner_form.get('comercio') as FormControl;
  }

  get dateFromControl(): FormControl {
    return this.contract_form.get('dateFrom') as FormControl;
  }

  get dateToControl(): FormControl {
    return this.contract_form.get('dateTo') as FormControl;
  }

  get obsControl(): FormControl {
    return this.contract_form.get('obs') as FormControl;
  }

  get nameStrategyControl(): FormControl {
    return this.order_form.get('nameStrategy') as FormControl;
  }

  get showNameControl(): FormControl {
    return this.order_form.get('showName') as FormControl;
  }

  get month(): FormControl {
    return this.order_form.get('month') as FormControl;
  }

  get obsOrderControl(): FormControl {
    return this.order_form.get('obs') as FormControl;
  }

  get btnControl(): boolean {
    return (
      this.dateTo === this.dateToControl.value &&
      this.obs === this.obsControl.value
    );
  }
  formatDateToYYYYMMDD(date: Date | string): string | undefined {
    if (!date) return undefined;

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  save() {
    const contract = new Contract(
      this.id,
      this.formatDateToYYYYMMDD(this.dateToControl.value),
      this.obsControl.value
    );
    console.log(contract.id);
    this.myDataService.patchContract(contract).subscribe({
      next: (response: any) => {
        this._snackBar.openSnackBar(response.message, 'success-snackbar');
      },
      error: (error: any) => {
        console.log(error);
        let errorMessage = error.error.errors
          ? error.error.errors || error.error.messages
          : error.error.messages;
        this._snackBar.openSnackBar(errorMessage, 'unsuccess-snackbar');
      },
    });
  }

  

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.audioFile = input.files[0];
      this.audioURL = URL.createObjectURL(this.audioFile);

      this.spot_form.get('name')?.setValue(this.audioFile.name);
      this.spot_form.get('path')?.setValue(this.audioFile.name);
      this.spot_form.updateValueAndValidity();

      this.calcularDuracion(this.audioURL);
    }
  }


  calcularDuracion(audioSrc: string) {
    const audio = new Audio(audioSrc);
    audio.addEventListener('loadedmetadata', () => {
      const minutos = Math.floor(audio.duration / 60);
      const segundos = Math.floor(audio.duration % 60);
      const duracionFinal = `${minutos}:${segundos.toString().padStart(2, '0')}`;

      this.duracionSpot = `${duracionFinal} min`;
      const duracionEnSegundos = Math.floor(audio.duration);
      this.spot_form.get('long')?.setValue(duracionEnSegundos);
      this.spot_form.updateValueAndValidity();
    });
  }

  openDialog(): void {
  
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          text: `<p>¿Seguro que desea crear la nueva Orden <strong>${this.nameStrategyControl.value}</strong>?</p>`,
        },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.createOrder();
        }
      });
    }

    cargarProximosDoceMeses(){
    let today = new Date()
    const actualMonth = format(today, 'MM-yyyy')
    this.validsNextYearMonths.push(actualMonth)
    for (let i = 0; i < 12; i++) {
      today = addMonths(today,1)
      const actualMonth = format(today, 'MM-yyyy')
      this.validsNextYearMonths.push(actualMonth)      
    }
  }
  
}
