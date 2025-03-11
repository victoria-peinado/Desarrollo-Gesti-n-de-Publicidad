import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Shop } from 'src/app/models/shop';
import { MyDataService } from 'src/app/services/my-data.service';
import { Contract } from 'src/app/models/contract';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-edicion-contratacion-category',
  templateUrl: './edicion-contratacion-category.component.html',
  styleUrl: './edicion-contratacion-category.component.scss'
})
export class EdicionContratacionCategoryComponent {
  @ViewChild('of') ownerNgForm: NgForm | undefined;

  owner_form: FormGroup;
  contract_form: FormGroup;
    shops: any[] = [];
    errorMessageOwner: string | null = null;
    cuit: string = '';
    comercios: string[] = [];
    ownerFounded: boolean = false;
    nextStep: boolean = false;

    contracts = [];

    contractsDetailed: {id: number, dateFrom: string, dateTo: string, regDate: string, observations: string}[] = [];
    
    columnDefs = [
      { key: 'index', label: 'N°' },
      { key: 'dateFrom', label: 'Fecha Desde' },
      { key: 'dateTo', label: 'Fecha Hasta' },
      { key: 'regDate', label: 'Fecha Realización' },
      { key: 'observations', label: 'Observaciones' },
      { key: 'id', label: 'Id' },
    ];
  dateTo: Date | null = null;
  dateFrom: Date | null = null;
  observations: string = '';
  id: string = '';
    
    constructor(public dialog: MatDialog, private myDataService: MyDataService, private _snackBar: SnackbarService,) {
      this.owner_form = new FormGroup({
        cuit: new FormControl('', [
          Validators.required,
          Validators.maxLength(11),
          Validators.minLength(11),
          Validators.pattern(/^[0-9]+$/),
        ]),
        comercio: new FormControl(
          { value: '', disabled: true },
          Validators.required
        ),
      });

      this.contract_form = new FormGroup({
        dateFrom: new FormControl({ value: '', disabled: false }),
        dateTo: new FormControl(''),
        observations: new FormControl(''),
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
          this.clearForm(this.ownerNgForm, {
            cuit: this.cuitControl.value,
            comercio: ''
          });
          this.nextStep = false;
          this.errorMessageOwner = 'Titular inexistente.';
        },
      });
    }
  
    next() {
      
      this.nextStep = true;
      const selectedShop = this.shops.find(shop => shop.fantasyName === this.comercioControl.value);
      if (selectedShop) {
        this.myDataService.getContractsByShopId(selectedShop.id).subscribe({
          next: (response: any) => {
            this.contracts = response.data;
            this.contractsDetailed = this.contracts.map((contract: any, index: number) => ({
              id: contract.id,
              index: index + 1,
              dateFrom: contract.dateFrom,
              dateTo: contract.dateTo,
              regDate: contract.regDate,
              observations: contract.observations
            }));
          },
          
          error: () => {
          }
        
      });}
    }

    onRowSelected(row: any) {


      console.log('row', row);

      this.dateFrom = row.dateFrom;
      this.dateTo = row.dateTo;
      this.observations = row.observations;
      this.id = row.id;
      
      this.dateFromControl.setValue(row.dateFrom);
      this.dateToControl.setValue(row.dateTo);
      this.observationsControl.setValue(row.observations);

      console.log('estado', row.estado);
      if(row.estado === "En curso"){
        console.log('no puede editar dateTo')
        this.contract_form.get('dateFrom')?.disable();

    }
    if(row.estado === "No iniciada") {
      this.contract_form.get('dateFrom')?.enable();

    }
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

    get observationsControl(): FormControl {
      return this.contract_form.get('observations') as FormControl;
    }

    get btnControl(): boolean {
      return (
        this.dateTo === this.dateToControl.value &&
        this.observations === this.observationsControl.value
      );
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
      const contract = new Contract(this.id, this.formatDateToYYYYMMDD(this.dateToControl.value), this.observationsControl.value);
      console.log(contract);
      this.myDataService.patchContract(contract).subscribe({
   
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
 

    openDialog() {
      
    }
}
