import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { Contract } from 'src/app/models/contract';
import { Shop } from 'src/app/models/shop';
import { MyDataService } from 'src/app/services/my-data.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-alta-contratacion-category',
  templateUrl: './alta-contratacion-category.component.html',
  styleUrl: './alta-contratacion-category.component.scss'
})
export class AltaContratacionCategoryComponent {
@ViewChild('of') ownerNgForm: NgForm | undefined;
@ViewChild('cf') contractNgForm: NgForm | undefined;


  owner_form: FormGroup;
  contract_form: FormGroup;
    shops: any[] = [];
    errorMessageOwner: string | null = null;
    cuit: string = '';
    comercios: string[] = [];
    ownerFounded: boolean = false;
    nextStep: boolean = false;

    contracts = [];

    contract: Contract = {
        dateFrom: '',
        observations: '',
        shop: ''
      };

    fantasyName: string = '';
    shopId: string = '';


    contractsDetailed: {id: number, dateFrom: string, dateTo: string, regDate: string, obs: string}[] = [];
    
    columnDefs = [
      { key: 'id', label: 'N°' },
      { key: 'dateFrom', label: 'Fecha Desde' },
      { key: 'dateTo', label: 'Fecha Hasta' },
      { key: 'regDate', label: 'Fecha Realización' },
      { key: 'obs', label: 'Observaciones' }
    ];
  dateTo: Date | null = null;
  dateFrom: Date | null = null;
  obs: string = '';
    
    constructor(public dialog: MatDialog, private _snackBar: SnackbarService, private myDataService: MyDataService) {
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
        dateFrom: new FormControl('', [Validators.required, this.verifyDate()]),
        dateTo: new FormControl(''),
        obs: new FormControl(''),
      });
    }

    ngOnInit() {
      this.dateToControl.valueChanges.subscribe((valor) => {
        this.dateTo = valor;
        this.dateFromControl.updateValueAndValidity();

      });
    }
    

verifyDate(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    console.log('value: ', value);
    console.log('date from: ', this.dateTo);
  
      if (!this.dateTo) {
        return null;
      } else {
        if (value >= this.dateTo) {
          return {dateToGreater:true};
        } else {
          return null;
        }
  
      }
  };
}

    
    
    
    






    clearForm(form: NgForm | undefined, values: any) {
        form?.resetForm(values);
      }
  
      clearAll() {
        this.owner_form.reset();
        this.contract_form.reset();
        this.clearForm(this.ownerNgForm, {
          cuit: '',
          comercio: ''
        });
        this.clearForm(this.contractNgForm, {
          dateFrom: '',
          dateTo: '',
          obs: '',
        });
        this.shops = [];
        this.comercios = [];
        this.nextStep = false;
        this.ownerFounded = false;
        this.fantasyName = '';
        this.contract_form.reset();
        this.owner_form.reset();
        this.errorMessageOwner = null;
        this.comercioControl.disable();
      }
    findOwner() {
  
  
      this.cuit = this.cuitControl.value;
  
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
      this.fantasyName = this.comercioControl.value;
      this.nextStep = true;

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

    getShopId() {
      const shop = this.shops.find(s => s.fantasyName === this.fantasyName);
      return this.shopId = shop ? shop.id : null;

    } 
    
    formatDateToYYYYMMDD(date: Date | string): string | undefined {
      if (!date) return undefined;
    
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0'); // sumamos 1 porque los meses empiezan en 0
      const day = String(d.getDate()).padStart(2, '0');
    
      return `${year}-${month}-${day}`;
    }
    
    createContract() {
        
        this.contract.dateFrom = this.formatDateToYYYYMMDD(this.dateFromControl.value);
          this.contract.dateTo = this.formatDateToYYYYMMDD(this.dateToControl.value);
        this.contract.observations = this.obsControl.value;
        this.contract.shop = this.getShopId();

        console.log('Contratación: ', this.contract);

        this.myDataService.createContract(this.contract).subscribe({
          next: (response: any) => {
            this._snackBar.openSnackBar(response.message, 'success-snackbar');
            this.clearAll();
          },
          error: (error: any) => {
            console.log(error);
            let errorMessage = error.error.errors ? error.error.errors || error.error.messages: error.error.messages;
            this._snackBar.openSnackBar(errorMessage, 'unsuccess-snackbar');
          },
        });
      }
    
      openDialog(): void {
        const dialogRef = this.dialog.open(DialogComponent, {
          data: {
            text: `<p>¿Seguro que desea crear la nueva Contratación para el Comercio ${this.comercioControl.value}?</p>`,
          },
        });
    
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.createContract();
          }
        });
      }
    
}
