import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { FISCAL_CONDITION_TYPES } from 'src/app/constants/constants';
import { Owner } from 'src/app/models/owner';
import { MyDataService } from 'src/app/services/my-data.service';

@Component({
  selector: 'app-alta-titular-category',
  templateUrl: './alta-titular-category.component.html',
  styleUrl: './alta-titular-category.component.scss',
})
export class AltaTitularCategoryComponent {
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective | undefined;
  owner_form: FormGroup;
  fiscalConditionTypes: string[] = FISCAL_CONDITION_TYPES;
  owner: Owner = {
    cuit: '',
    businessName: '',
    fiscalCondition: '',
  };

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
      businessName: new FormControl('', Validators.required),
      fiscalCondition: new FormControl('', Validators.required),
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

  clearForm() {
    this.formDirective?.resetForm();
  }

  createOwner() {
    this.owner.cuit = this.cuitControl.value;
    this.owner.businessName = this.businessNameControl.value;
    this.owner.fiscalCondition = this.fiscalConditionControl.value;

    this.myDataService.createOwner(this.owner).subscribe({
      next: () => {
        this.openSnackBar(
          `Titular ${this.businessNameControl.value} creado con éxito`,
          'Cerrar'
        );
        this.clearForm()
      },
      error: () => {
        this.openSnackBar(
          `Error al crear el titular ${this.businessNameControl.value}`,
          'Cerrar'
        );
      },
    });
  }

  openDialog(): void {
    console.log('xd');
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        text: `<p>¿Seguro que desea crear el nuevo Titular ${this.businessNameControl.value}?</p>`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createOwner();
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
