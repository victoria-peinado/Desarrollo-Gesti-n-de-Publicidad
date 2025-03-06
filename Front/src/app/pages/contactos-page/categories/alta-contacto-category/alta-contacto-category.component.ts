import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { Contact } from 'src/app/models/contact.js';
import { MyDataService } from 'src/app/services/my-data.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-alta-contacto-category',
  templateUrl: './alta-contacto-category.component.html',
  styleUrl: './alta-contacto-category.component.scss',
})
export class AltaContactoCategoryComponent {
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective | undefined;
  contact_form: FormGroup;

  contact: Contact = {
    dni: '',
    name: '',
    lastname: '',
    contacts: ['marcosdelsolar7@gmail.com']
  };

  constructor(
    public dialog: MatDialog,
    private _snackBar: SnackbarService,
    private myDataService: MyDataService
  ) {
    this.contact_form = new FormGroup({
      dni: new FormControl('', [
        Validators.required,
        Validators.maxLength(8),
        Validators.minLength(8),
        Validators.pattern(/^[0-9]+$/),
      ]),
      name: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
    });
  }

  get dniControl(): FormControl {
    return this.contact_form.get('dni') as FormControl;
  }

  get nameControl(): FormControl {
    return this.contact_form.get('name') as FormControl;
  }

  get lastnameControl(): FormControl {
    return this.contact_form.get('lastname') as FormControl;
  }

  clearForm() {
    this.formDirective?.resetForm();
  }

  createContact() {
    this.contact.dni = this.dniControl.value;
    this.contact.name = this.nameControl.value;
    this.contact.lastname = this.lastnameControl.value;

    this.myDataService.createContact(this.contact).subscribe({
      next: (response: any) => {
        this._snackBar.openSnackBar(response.message, 'success-snackbar');
        this.clearForm();
      },
      error: (error: any) => {
        let errorMessage = error.error.errors ? error.error.errors || error.error.messages: error.error.messages;
        this._snackBar.openSnackBar(errorMessage, 'unsuccess-snackbar');
      },
    });
  }

  openDialog(): void {
    console.log('xd');
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        text: `<p>¿Seguro que desea crear el nuevo Contacto ${this.nameControl.value + ' ' + this.lastnameControl.value}?</p>`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createContact();
      }
    });
  }

}
