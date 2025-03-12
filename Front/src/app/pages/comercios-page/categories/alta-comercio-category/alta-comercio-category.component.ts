import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { set } from 'date-fns';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { InputContactsComponent } from 'src/app/components/input-contacts/input-contacts.component';

import {
  BILLING_TYPES,
  FISCAL_CONDITION_TYPES,
  SHOP_TYPES,
  USUAL_PAYMENT_FORMS,
} from 'src/app/constants/constants';
import { Contact } from 'src/app/models/contact.js';
import { Owner } from 'src/app/models/owner.js';
import { Shop } from 'src/app/models/shop.js';
import { MyDataService } from 'src/app/services/my-data.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { z } from 'zod';

@Component({
  selector: 'app-alta-comercio-category',
  templateUrl: './alta-comercio-category.component.html',
  styleUrl: './alta-comercio-category.component.scss',
})
export class AltaComercioCategoryComponent {
  @ViewChild(InputContactsComponent)
  inputContactsComponent!: InputContactsComponent;
  @ViewChild('cf') contactNgForm: NgForm | undefined;
  @ViewChild('of') ownerNgForm: NgForm | undefined;
  @ViewChild('sf') shopNgForm: NgForm | undefined;

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

  owner_form: FormGroup;
  shop_form: FormGroup;

  isOwnerChecked: boolean = true;
  isOwnerFirstChecked: boolean = false;
  isNextContact: boolean = false;
  isNextShop: boolean = false;

  fantasyName: string = '';
  bussinessName: string = '';
  cuit: string = '';
  ownerFounded: boolean = false;
  ownerId: string = '';
  shops: Shop[] = [];
  shopsFantasyName: string[] = [];

  billingTypes: string[] = BILLING_TYPES;
  fiscalConditionTypes: string[] = FISCAL_CONDITION_TYPES;
  usualPaymentForms: string[] = USUAL_PAYMENT_FORMS;
  shopTypes: string[] = SHOP_TYPES;

  errorMessageOwner: string | null = null;
  btn: any;
  clicked: boolean = false;

  numbers: string[] = [];

  constructor(
    public dialog: MatDialog,
    private _snackBar: SnackbarService,
    private myDataService: MyDataService,
    private sharedDataService: SharedDataService
  ) {
    this.owner_form = new FormGroup({
      cuit: new FormControl('', [
        Validators.required,
        Validators.maxLength(11),
        Validators.minLength(11),
        Validators.pattern(/^[0-9]+$/),
        sharedDataService.verifyCuit()
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

    this.shop_form = new FormGroup({
      fantasyName: new FormControl('', [Validators.required, this.verifyFantasyNameRepeated()]),
      address: new FormControl('', [Validators.required, sharedDataService.verifyAddress()]),
      billingType: new FormControl('', Validators.required),
      mail: new FormControl('', [Validators.required, this.verifyEmail()]),
      usualPaymentForm: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    setTimeout(() => this.inputContactsComponent.disableForm());
  }

  verifyFantasyNameRepeated(): ValidatorFn {
      return (control: AbstractControl) : ValidationErrors | null => {
        const value = control.value;
  
        if (this.shopsFantasyName.includes(value)) {
          return {fantasyNameRepeated:true};
        } else {
          return null;
        }
  
      }
    }

    

    verifyEmail(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const schema = z.string().email({ message: "Invalid email address" });
        const result = schema.safeParse(control.value);
    
        return result.success ? null : { invalidEmail: true };
      };
    }
  clearForm(form: NgForm | undefined, values: any) {
    form?.resetForm(values);
  }

  findOwner() {
    this.cuit = this.cuitControl.value.trim();

    if (!this.cuit) return;

    this.myDataService.getOwnerByCuit(this.cuit).subscribe({
      next: (response: any) => {
        this.bussinessName = response.data.businessName;
        this.ownerFounded = true;
        this.errorMessageOwner = null;
        this.ownerId = response.data.id;
        this.shops = response.data.shops;
        this.shopsFantasyName = response.data.shops.map(
          (shop: Shop) => shop.fantasyName
        );
        this.businessNameControl.disable();
        this.fiscalConditionControl.disable();
        this.businessNameControl.setValue(response.data.businessName);
        this.fiscalConditionControl.setValue(response.data.fiscalCondition);
      },
      error: () => {
        this.ownerFounded = false;
        this.businessNameControl.enable();
        this.fiscalConditionControl.enable();
        this.clearForm(this.ownerNgForm, {
          cuit: this.cuitControl.value,
          businessName: '',
          fiscalCondition: '',
        });
        this.ownerId = '';
        this.errorMessageOwner = 'Titular nuevo.';
      },
    });
  }

  findContact() {
    this.dni = this.dniControl.value.trim();

    if (!this.dni) return;

    this.myDataService.getContactByDni(this.dni).subscribe({
      next: (response: any) => {
        this.contactFounded = true;
        this.errorMessageContact = null;
        this.contactId = response.data.id;
        this.nameControl.disable();
        this.lastnameControl.disable();
        this.inputContactsComponent.disableForm();
        this.nameControl.setValue(response.data.name);
        this.lastnameControl.setValue(response.data.lastname);
        this.inputContactsComponent.contacts = response.data.contacts;
      },
      error: () => {
        this.contactFounded = false;
        this.nameControl.enable();
        this.lastnameControl.enable();
        this.inputContactsComponent.enableForm();
        this.clearForm(this.contactNgForm, {
          dni: this.dniControl.value,
          name: '',
          lastname: '',
        });
        this.inputContactsComponent.clearForm();
        this.contactId = '';
        this.errorMessageContact = 'Contacto nuevo.';
      },
    });
  }

  addContacts() {
    const newNumber = this.contactsControl.value.trim();

    if (newNumber && !this.numbers.includes(newNumber)) {
      this.numbers.push(newNumber);
      this.contactsControl.reset();
    }

  }

  removeContacts(number: string) {
    this.numbers = this.numbers.filter((n) => n !== number);
  }

  get fantasyNameControl(): FormControl {
    return this.shop_form.get('fantasyName') as FormControl;
  }

  get addressControl(): FormControl {
    return this.shop_form.get('address') as FormControl;
  }
  get billingTypeControl(): FormControl {
    return this.shop_form.get('billingType') as FormControl;
  }
  get mailControl(): FormControl {
    return this.shop_form.get('mail') as FormControl;
  }
  get usualPaymentFormControl(): FormControl {
    return this.shop_form.get('usualPaymentForm') as FormControl;
  }
  get typeControl(): FormControl {
    return this.shop_form.get('type') as FormControl;
  }

  get nameControl(): FormControl {
    return this.contact_form.get('name') as FormControl;
  }
  get lastnameControl(): FormControl {
    return this.contact_form.get('lastname') as FormControl;
  }
  get dniControl(): FormControl {
    return this.contact_form.get('dni') as FormControl;
  }
  get contactMailControl(): FormControl {
    return this.contact_form.get('contactMail') as FormControl;
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

  get contactsControl(): FormControl {
    return this.contact_form.get('contacts') as FormControl;
  }

  get btnControl(): boolean {
    return (
      this.name === this.nameControl.value &&
      this.lastname === this.lastnameControl.value &&
      this.initialContacts.slice().sort().join(', ') ===
        this.inputContactsComponent.contacts.slice().sort().join(', ')
    );
  }

  clearAllForm() {
    this.businessNameControl.disable();
    this.fiscalConditionControl.disable();
    this.nameControl.disable();
    this.lastnameControl.disable();
    this.inputContactsComponent.disableForm();
    this.ownerNgForm?.resetForm();
    this.contactNgForm?.resetForm();
    this.inputContactsComponent.clearForm();
    this.shopNgForm?.resetForm();

    this.errorMessageContact = null;
    this.dni = '';
    this.contactFounded = false;
    this.name = '';
    this.lastname = '';
    this.cargando = false;
    this.contactId = '';
    this.contact = {};
    this.contacts = [];
    this.initialContacts = [];
    this.isOwnerChecked = true;
    this.isOwnerFirstChecked = false;
    this.isNextContact = false;
    this.isNextShop = false;
    this.fantasyName = '';
    this.bussinessName = '';
    this.cuit = '';
    this.ownerFounded = false;
    this.ownerId = '';
    this.shops = [];
    this.shopsFantasyName = [];
    this.errorMessageOwner = null;
    this.clicked = false;
    this.numbers = [];
    
  }

  getOwnerId(): Observable<string> {
    if (this.ownerId) {
      return of(this.ownerId);
    }

    const ownerData: Owner = {
      cuit: this.cuitControl.value,
      businessName: this.businessNameControl.value,
      fiscalCondition: this.fiscalConditionControl.value,
    };

    return this.myDataService.createOwner(ownerData).pipe(
      map((response: any) => {
        this.ownerId = response.data.id;
        return this.ownerId;
      }),
      catchError((error) => {
        console.error('Error creating owner:', error);
        return throwError(() => new Error('Failed to create owner'));
      })
    );
  }

  getContactId(): Observable<string> {
    if (this.contactId) {
      return of(this.contactId);
    }

    const contactData: Contact = {
      dni: this.dniControl.value,
      name: this.nameControl.value,
      lastname: this.lastnameControl.value,
      contacts: this.contacts,
    };

    return this.myDataService.createContact(contactData).pipe(
      map((response: any) => {
        this.contactId = response.data.id;
        return this.contactId;
      }),
      catchError((error) => {
        console.error('Error creating contact:', error);
        return throwError(() => new Error('Failed to create contact'));
      })
    );
  }

  createShop() {
    this.getOwnerId()
      .pipe(
        switchMap((ownerId) => {
          this.ownerId = ownerId;
          return this.getContactId();
        }),
        switchMap((contactId) => {
          this.contactId = contactId;

          const shopData: Shop = {
            fantasyName: this.fantasyNameControl.value,
            address: this.addressControl.value,
            billingType: this.billingTypeControl.value,
            mail: this.mailControl.value,
            usualPaymentForm: this.usualPaymentFormControl.value,
            type: this.typeControl.value,
            owner: this.ownerId,
            contact: this.contactId,
          };

          console.log(shopData);

          return this.myDataService.createShop(shopData);
        })
      )
      .subscribe({
        next: (response: any) => {
          this._snackBar.openSnackBar(response.message, 'success-snackbar');
          this.clearAllForm();
        },
        error: (error: any) => {
          let errorMessage = error.error.errors ? error.error.errors || error.error.messages: error.error.messages;
          this._snackBar.openSnackBar(errorMessage, 'unsuccess-snackbar');
        },
      });
  }

  nextContact() {
    this.isNextContact = true;
  }

  nextShop() {
    this.isNextShop = true;
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        text: `<p>¿Seguro que desea crear el nuevo Comercio <strong>${this.fantasyNameControl.value}</strong> para el Titular <strong>${this.businessNameControl.value}</strong>?</p>`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createShop();
      }
    });
  }

}
