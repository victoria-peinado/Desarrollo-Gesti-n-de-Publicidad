import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { FISCAL_CONDITION_TYPES } from 'src/app/constants/constants';
import { Owner } from 'src/app/models/owner';
import { MyDataService } from 'src/app/services/my-data.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

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
    private _snackBar: SnackbarService,
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
      next: (response) => {
        console.log(response);
        this._snackBar.openSnackBar(`Titular ${this.businessNameControl.value} creado con éxito`, 'success-snackbar');
        this.clearForm()
      },
      error: (err) => {
        console.log(err);
        this._snackBar.openSnackBar(err.error.message, 'unsuccess-snackbar');
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

}
