import { Component, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { InputContactsComponent } from 'src/app/components/input-contacts/input-contacts.component';
import { ATTRIBUTE_MAPPING } from 'src/app/constants/attribute-mapping';
import { FISCAL_CONDITION_TYPES } from 'src/app/constants/constants';
import { MyDataService } from 'src/app/services/my-data.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-edicion-contacto-category',
  templateUrl: './edicion-contacto-category.component.html',
  styleUrl: './edicion-contacto-category.component.scss',
})
export class EdicionContactoCategoryComponent {
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective | undefined;
  @ViewChild(InputContactsComponent)
  inputContactsComponent!: InputContactsComponent;

  contact_form: FormGroup;
  errorMessageContact: string | null = null;
  dni: string = '';
  contactFounded: boolean = false;
  name: string = '';
  lastname: string = '';
  cargando: boolean = false;
  contactId: string = '';
  contact: any = {};
  contacts: string[] = [];
  initialContacts: string[] = [];

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
      name: new FormControl({ value: '', disabled: true }, Validators.required),
      lastname: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
    });
  }

  ngOnInit(): void {
    setTimeout(() => this.inputContactsComponent.disableForm());
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
        this.initialContacts = [...response.data.contacts];
        this.contacts = [...response.data.contacts];
        this.errorMessageContact = null;
        this.nameControl.enable();
        this.lastnameControl.enable();
        this.inputContactsComponent.enableForm();
        this.nameControl.setValue(response.data.name);
        this.lastnameControl.setValue(response.data.lastname);
      },
      error: () => {
        this.contactFounded = false;
        this.cargando = false;
        this.errorMessageContact = 'Contacto inexistente.';
        this.nameControl.disable();
        this.lastnameControl.disable();
        this.inputContactsComponent.disableForm();
        this.nameControl.reset();
        this.lastnameControl.reset();
        this.inputContactsComponent.clearForm();
        console.log('pasó por aquí');
      },
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

  get btnControl(): boolean {
    return (
      this.name === this.nameControl.value &&
      this.lastname === this.lastnameControl.value &&
      this.initialContacts.slice().sort().join(', ') ===
        this.inputContactsComponent.contacts.slice().sort().join(', ')
    );
  }

  clearForm() {
    this.nameControl.disable();
    this.lastnameControl.disable();
    this.inputContactsComponent.disableForm();
    this.formDirective?.resetForm();
    this.inputContactsComponent.clearForm();
    this.errorMessageContact = null;
    this.contactFounded = false;
    this.dni = '';
    this.name = '';
    this.lastname = '';
    this.cargando = false;
    this.contactId = '';
    this.contact = {};
  }
  patchContact() {
    if (this.name !== this.nameControl.value) {
      this.contact.name = this.nameControl.value;
    }

    if (this.lastname !== this.lastnameControl.value) {
      this.contact.lastname = this.lastnameControl.value;
    }

    if (
      this.initialContacts.slice().sort().join(', ') !==
      this.inputContactsComponent.contacts.slice().sort().join(', ')
    ) {
      this.contact.contacts = this.inputContactsComponent.contacts;
    }

    this.myDataService.patchContact(this.contactId, this.contact).subscribe({
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
    const contactFieldsToCheck = [
      { key: 'name', control: this.nameControl, initialValue: this.name },
      {
        key: 'lastname',
        control: this.lastnameControl,
        initialValue: this.lastname,
      },
      {
        key: 'contacts',
        control: this.inputContactsComponent.contacts,
        initialValue: this.initialContacts,
      },
    ];

    const modifiedContactAttributes: any = {};
    const changesList: any[] = [];

    contactFieldsToCheck.forEach((field) => {
      let currentValue =
        field.control instanceof FormControl
          ? field.control.value
          : field.control;
      let initialValue = field.initialValue;

      if (Array.isArray(currentValue)) {
        currentValue = currentValue.join(', ');
      }
      if (Array.isArray(initialValue)) {
        initialValue = initialValue.join(', ');
      }

      if (currentValue !== initialValue) {
        modifiedContactAttributes[field.key] = currentValue;
        changesList.push({
          attribute: ATTRIBUTE_MAPPING[field.key] || field.key,
          oldValue: initialValue,
          newValue: currentValue,
        });
      }
    });

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        text: `<p>¿Seguro que desea editar el Contacto de DNI <strong>${this.dni}</strong>?</p>`,
        changes: changesList,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.patchContact();
      }
    });
  }
}
