import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MyDataService } from 'src/app/services/my-data.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-baja-contacto-category',
  templateUrl: './baja-contacto-category.component.html',
  styleUrl: './baja-contacto-category.component.scss'
})
export class BajaContactoCategoryComponent {
@ViewChild(FormGroupDirective) formDirective: FormGroupDirective | undefined;

  dni_form: FormGroup;
  errorMessage: string | null = null;
  dni: string = '';
  contactFounded: boolean = false;
  name: string = '';
  lastname: string = '';
  contacts: string = '';
  cargando: boolean = false;
  contactId: string = '';

  constructor(
    public dialog: MatDialog,
    private _snackBar: SnackbarService,
    private myDataService: MyDataService
  ) {
    this.dni_form = new FormGroup({
      dni: new FormControl('', [
        Validators.required,
        Validators.maxLength(8),
        Validators.minLength(8),
        Validators.pattern(/^[0-9]+$/),
      ]),
    });
  }

  findContact() {
    this.dni = this.dniControl.value.trim();

    if (!this.dni) return;
    this.cargando = true;
    this.myDataService.getContactByDni(this.dni).subscribe({
      next: (response) => {
        this.contactFounded = true;
        this.contactId = response.data.id;
        this.dni = response.data.dni;
        this.name = response.data.name;
        this.lastname = response.data.lastname;
        this.contacts = response.data.contacts.join(", ");
        this.errorMessage = null;
      },
      error: (error) => {
        console.log(error);
        this.contactFounded = false;
        this.cargando = false;
        this.errorMessage = 'Contacto inexistente.';
      },
    });
  }

  get dniControl(): FormControl {
    return this.dni_form.get('dni') as FormControl;
  }

  clearForm() {
    this.formDirective?.resetForm();
    this.errorMessage = null;
    this.contactFounded = false;
    this.dni = '';
    this.name = '';
    this.lastname = '';
    this.contacts = '';
    this.cargando = false;
    this.contactId = '';
  }

  deleteContact() {
    this.myDataService.deleteContact(this.contactId).subscribe({
      next: (response: any) => {
        this._snackBar.openSnackBar(response.message, 'success-snackbar');
        this.clearForm();
      },
      error: (error: any) => {
        let errorMessage = error.error.errors
          ? error.error.errors || error.error.messages
          : error.error.messages;
        this._snackBar.openSnackBar(errorMessage, 'unsuccess-snackbar');
      },
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        text: `<p>¿Seguro que desea eliminar el Contacto de DNI <strong>${this.dni}</strong>?</p>`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteContact();
      }
    });
  }
}
