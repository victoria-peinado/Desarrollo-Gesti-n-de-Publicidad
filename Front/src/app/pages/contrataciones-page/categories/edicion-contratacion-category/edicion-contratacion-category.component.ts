import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Shop } from 'src/app/models/shop';
import { MyDataService } from 'src/app/services/my-data.service';

@Component({
  selector: 'app-edicion-contratacion-category',
  templateUrl: './edicion-contratacion-category.component.html',
  styleUrl: './edicion-contratacion-category.component.scss'
})
export class EdicionContratacionCategoryComponent {
  owner_form: FormGroup;
  contract_form: FormGroup;
    shops: any[] = [];
    errorMessage: string | null = null;
    cuit: string = '';
    comercios: string[] = [];
    ownerFounded: boolean = false;
    
    constructor(public dialog: MatDialog, private myDataService: MyDataService) {
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
        dateFrom: new FormControl('', Validators.required),
        dateTo: new FormControl('', Validators.required),
        obs: new FormControl(''),
      });
    }
  
  
    findOwner() {
  
  
      this.cuit = this.cuitControl.value.trim();
  
      if(!this.cuit) return;
  
      this.myDataService.getOwnerByCuit(this.cuit).subscribe({
        next: (response: any) => {
          this.ownerFounded = true;
          this.shops = response.data.shops;
          this.errorMessage = null;
          this.comercios = response.data.shops.map(
            (shop: Shop) => shop.fantasyName
          );
          this.comercioControl.enable();
        },
        error: () => {
          this.ownerFounded = false;
          this.shops = [];
          this.comercioControl.disable();
          this.errorMessage = 'Titular inexistente.';
        },
      });
    }
  
    siguiente() {
        
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


    openDialog() {
      
    }
}
