import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { Contact } from 'src/app/models/contact';
import { MyDataService } from 'src/app/services/my-data.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { InputContactsComponent } from 'src/app/components/input-contacts/input-contacts.component';

@Component({
  selector: 'app-alta-contacto-category',
  templateUrl: './alta-contacto-category.component.html',
  styleUrl: './alta-contacto-category.component.scss',
})
export class AltaContactoCategoryComponent {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  contacts: string[] = [];

  
  
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective | undefined;
  @ViewChild(InputContactsComponent) inputContactsComponent!: InputContactsComponent;
  

  contact_form: FormGroup;
  contact: Contact = {
    dni: '',
    name: '',
    lastname: '',
    contacts: []
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
      lastname: new FormControl('', Validators.required)
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
    this.inputContactsComponent.clearForm();
    this.contacts = [];
    this.contact ={
      dni: '',
      name: '',
      lastname: '',
      contacts: []}
    
  }

  createContact() {
    this.contact.dni = this.dniControl.value;
    this.contact.name = this.nameControl.value;
    this.contact.lastname = this.lastnameControl.value;
    this.contact.contacts = this.contacts;

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
    console.log(this.contacts);
    console.log('xd');
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        text: `<p>¿Seguro que desea crear el nuevo Contacto <strong>${this.nameControl.value + ' ' + this.lastnameControl.value}</strong>?</p>`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createContact();
      }
    });
  }

}
