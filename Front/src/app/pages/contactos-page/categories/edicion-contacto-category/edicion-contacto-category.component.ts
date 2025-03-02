import { Component, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { FISCAL_CONDITION_TYPES } from 'src/app/constants/constants';
import { Owner } from 'src/app/models/owner.js';
import { MyDataService } from 'src/app/services/my-data.service';

@Component({
  selector: 'app-edicion-contacto-category',
  templateUrl: './edicion-contacto-category.component.html',
  styleUrl: './edicion-contacto-category.component.scss'
})
export class EdicionContactoCategoryComponent {
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective | undefined;
  
    owner_form: FormGroup;
    errorMessageOwner: string | null = null;
    cuit: string = '';
    ownerFounded: boolean = false;
    bussinessName: string = '';
    fiscalCondition: string = '';
    cargando: boolean = false;
    ownerId: string = '';
    owner: any = {};
    fiscalConditionTypes: string[] = FISCAL_CONDITION_TYPES;
  
    constructor(
      public dialog: MatDialog,
      private _snackBar: MatSnackBar,
      private myDataService: MyDataService
    ) {
      this.owner_form = new FormGroup({
        cuit: new FormControl('', [
          Validators.required,
          Validators.maxLength(11),
          Validators.minLength(11),
          Validators.pattern(/^[0-9]+$/),
        ]),
        businessName: new FormControl(
          { value: '', disabled: true },
          Validators.required
        ),
        fiscalCondition: new FormControl(
          { value: '', disabled: true },
          Validators.required
        ),
      });
    }
  
    findOwner() {
      this.cuit = this.cuitControl.value.trim();
  
      if (!this.cuit) return;
      this.cargando = true;
      this.myDataService.getOwnerByCuit(this.cuit).subscribe({
        next: (response) => {
          this.ownerFounded = true;
          this.ownerId = response.data.id;
          this.cuit = response.data.cuit;
          this.bussinessName = response.data.businessName;
          this.fiscalCondition = response.data.fiscalCondition;
          this.errorMessageOwner = null;
          this.businessNameControl.enable();
          this.fiscalConditionControl.enable();
          this.businessNameControl.setValue(response.data.businessName);
          this.fiscalConditionControl.setValue(response.data.fiscalCondition);
        },
        error: () => {
          this.ownerFounded = false;
          this.cargando = false;
          this.errorMessageOwner = 'Titular inexistente.';
          this.businessNameControl.disable();
          this.fiscalConditionControl.disable();
          this.businessNameControl.reset();
          this.fiscalConditionControl.reset();
          console.log('pasó por aquí');
        },
      });
    }
  
    get cuitControl(): FormControl {
      return this.owner_form.get('cuit') as FormControl;
    }
  
    get businessNameControl(): FormControl {
      return this.owner_form.get('businessName') as FormControl;
    }
  
    get fiscalConditionControl(): FormControl {
      return this.owner_form.get('fiscalCondition') as FormControl;
    }
  
    get btnControl(): boolean {
      return (
        this.bussinessName === this.businessNameControl.value &&
        this.fiscalCondition === this.fiscalConditionControl.value
      );
    }
  
    clearForm() {
      this.formDirective?.resetForm();
      this.errorMessageOwner = null;
      this.ownerFounded = false;
      this.bussinessName = '';
      this.fiscalCondition = '';
      this.cargando = false;
      this.ownerId = '';
      this.owner = {};
    }
    patchOwner() {
      if (this.bussinessName != this.businessNameControl.value) {
        this.owner.businessName = this.businessNameControl.value;
      }
  
      if (this.fiscalCondition != this.fiscalConditionControl.value) {
        this.owner.fiscalCondition = this.fiscalConditionControl.value;
      }
  
      this.myDataService
        .patchOwner(this.ownerId, this.owner)
        .subscribe((response) => {
          this.clearForm();
          this.openSnackBar('Titular modificado exitosamente', 'Cerrar');
        });
    }
  
    openDialog(): void {
      console.log('xd');
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          text: `<p>¿Seguro que desea editar el Titular de CUIT <strong>${this.cuit}</strong>?</p>`,
        },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.patchOwner();
        }
      });
    }
  
    openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action, {
        duration: 5000,
      });
    }

}
