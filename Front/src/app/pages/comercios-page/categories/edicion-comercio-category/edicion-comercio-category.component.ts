import { Component, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  BILLING_TYPES,
  FISCAL_CONDITION_TYPES,
  SHOP_TYPES,
  USUAL_PAYMENT_FORMS,
} from 'src/app/constants/constants';
import { Shop } from 'src/app/models/shop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MyDataService } from 'src/app/services/my-data.service';
import { ATTRIBUTE_MAPPING } from 'src/app/constants/attribute-mapping';
import { InputContactsComponent } from 'src/app/components/input-contacts/input-contacts.component';
import { z } from 'zod';

@Component({
  selector: 'app-edicion-comercio-category',
  templateUrl: './edicion-comercio-category.component.html',
  styleUrl: './edicion-comercio-category.component.scss',
})
export class EdicionComercioCategoryComponent {
  @ViewChild(InputContactsComponent)
  inputContactsComponent!: InputContactsComponent;
  @ViewChild('osf') ownerShopNgForm: NgForm | undefined;
  @ViewChild('cf') contactNgForm: NgForm | undefined;
  @ViewChild('of') ownerNgForm: NgForm | undefined;
  @ViewChild('sf') shopNgForm: NgForm | undefined;

  owner_shop_form: FormGroup;
  owner_form: FormGroup;
  shop_form: FormGroup;
  contact_form: FormGroup;
  shops: any[] = [];
  errorMessage: string | null = null;
  errorMessageOwner: string | null = null;
  cuit: string = '';
  comercios: string[] = [];
  fiscalCondition: string = '';
  shopFounded: boolean = false;
  fantasyName: string = '';
  address: string = '';
  billingType: string = '';
  mail: string = '';
  usualPaymentForm: string = '';
  type: string = '';
  name: string = '';
  lastname: string = '';
  dni: string = '';
  ownerFounded: boolean = false;
  businessName: string = '';
  nextStep: boolean = false;
  billingTypes: string[] = BILLING_TYPES;
  fiscalConditionTypes: string[] = FISCAL_CONDITION_TYPES;
  usualPaymentForms: string[] = USUAL_PAYMENT_FORMS;
  shopTypes: string[] = SHOP_TYPES;
  shopsFantasyName: string[] = [];
  contacts: string[] = [];
  initialContacts: string[] = [];
  ownerId: string = '';
  contactFounded: boolean = true;
  errorMessageContact: string | null = null;
  contactId: string = ''

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private myDataService: MyDataService
  ) {
    this.owner_shop_form = new FormGroup({
      cuitOwner: new FormControl('', [
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

    this.owner_form = new FormGroup({
      cuit: new FormControl('', [
        Validators.required,
        Validators.maxLength(11),
        Validators.minLength(11),
        Validators.pattern(/^[0-9]+$/),
      ]),
      businessName: new FormControl(
        { value: '', disabled: false },
        Validators.required
      ),
      fiscalCondition: new FormControl(
        { value: '', disabled: false },
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
      name: new FormControl(
        { value: '', disabled: false },
        Validators.required
      ),
      lastname: new FormControl(
        { value: '', disabled: false },
        Validators.required
      ),
    });

    this.shop_form = new FormGroup({
      fantasyName: new FormControl('', [
        Validators.required,
        this.verifyFantasyNameRepeated(),
      ]),
      address: new FormControl('', Validators.required),
      billingType: new FormControl('', Validators.required),
      mail: new FormControl('', [Validators.required, this.verifyEmail()]),
      usualPaymentForm: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
    });
  }

  verifyFantasyNameRepeated(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (this.shopsFantasyName.includes(value)) {
        return { fantasyNameRepeated: true };
      } else {
        return null;
      }
    };
  }

  verifyEmail(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const schema = z.string().email({ message: 'Invalid email address' });
      const result = schema.safeParse(control.value);

      return result.success ? null : { invalidEmail: true };
    };
  }
  clearForm(form: NgForm | undefined, values: any) {
    form?.resetForm(values);
  }

  findShopOwner() {
    this.cuit = this.cuitControl.value;

    if (!this.cuit) return;

    this.myDataService.getOwnerByCuit(this.cuit).subscribe({
      next: (response: any) => {
        this.businessName = response.data.businessName;
        this.ownerFounded = true;
        this.fiscalCondition = response.data.fiscalCondition;
        this.cuit = response.data.cuit;
        this.shops = response.data.shops;
        this.errorMessageOwner = null;
        this.comercios = response.data.shops.map(
          (shop: Shop) => shop.fantasyName
        );
        this.comercioControl.enable();
        this.clearForm(this.ownerShopNgForm, {
          cuitOwner: this.cuitControl.value,
          comercio: '',
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

  findOwner() {
    this.cuit = this.cuitControl.value.trim();

    if (!this.cuit) return;

    this.myDataService.getOwnerByCuit(this.cuit).subscribe({
      next: (response: any) => {
        this.businessName = response.data.businessName;
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

  next() {
    this.nextStep = true;

    const selectedShop = this.shops.find(
      (shop) => shop.fantasyName === this.comercioControl.value
    );

    if (selectedShop) {
      this.fantasyName = selectedShop.fantasyName;
      this.address = selectedShop.address;
      this.billingType = selectedShop.billingType;
      this.mail = selectedShop.mail;
      this.usualPaymentForm = selectedShop.usualPaymentForm;
      this.type = selectedShop.type;

      this.fantasyNameControl.setValue(this.fantasyName);
      this.addressControl.setValue(this.address);
      this.billingTypeControl.setValue(this.billingType);
      this.mailControl.setValue(this.mail);
      this.usualPaymentFormControl.setValue(this.usualPaymentForm);
      this.typeControl.setValue(this.type);

      this.shopFounded = true;
    }

    if (this.cuit) {
      this.cuitControl.setValue(this.cuit);
      this.businessNameControl.setValue(this.businessName);
      this.fiscalConditionControl.setValue(this.fiscalCondition);
    }

    this.myDataService.getContactById(selectedShop.contact).subscribe({
      next: (response) => {
        this.dni = response.data.dni;
        this.name = response.data.name;
        this.lastname = response.data.lastname;
        this.initialContacts = [...response.data.contacts];
        this.contacts = [...response.data.contacts];

        this.dniControl.setValue(this.dni);
        this.nameControl.setValue(this.name);
        this.lastnameControl.setValue(this.lastname);
      },
      error: () => {},
    });
  }

  get cuitOwnerControl(): FormControl {
    return this.owner_shop_form.get('cuitOwner') as FormControl;
  }

  get comercioControl(): FormControl {
    return this.owner_shop_form.get('comercio') as FormControl;
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
      this.fantasyName === this.fantasyNameControl.value &&
      this.address === this.addressControl.value &&
      this.billingType === this.billingTypeControl.value &&
      this.mail === this.mailControl.value &&
      this.usualPaymentForm === this.usualPaymentFormControl.value &&
      this.type === this.typeControl.value &&

      this.cuit === this.cuitControl.value &&
      this.businessName === this.businessNameControl.value &&
      this.fiscalCondition === this.fiscalConditionControl.value &&

      this.dni === this.dniControl.value &&
      this.name === this.nameControl.value &&
      this.lastname === this.lastnameControl.value &&
      this.initialContacts.slice().sort().join(', ') ===
        this.inputContactsComponent.contacts.slice().sort().join(', ')
    );
  }

  patchShop() {

  }
  openDialog(): void {
    const ownerFieldsToCheck = [
      { key: 'cuit', control: this.cuitControl, initialValue: this.cuit },
      { key: 'businessName', control: this.businessNameControl, initialValue: this.businessName},
      { key: 'fiscalCondition', control: this.fiscalConditionControl, initialValue: this.fiscalCondition },
    ];

    const contactFieldsToCheck = [
      { key: 'name', control: this.nameControl, initialValue: this.name },
      { key: 'lastname', control: this.lastnameControl, initialValue: this.lastname},
      { key: 'dni', control: this.dniControl, initialValue: this.dni },
      { key: 'contacts', control: this.inputContactsComponent.contacts, initialValue: this.initialContacts},
    ];

    const shopFieldsToCheck = [
      { key: 'fantasyName', control: this.fantasyNameControl, initialValue: this.fantasyName },
      { key: 'address', control: this.addressControl, initialValue: this.address },
      { key: 'billingType', control: this.billingTypeControl, initialValue: this.billingType },
      { key: 'mail', control: this.mailControl, initialValue: this.mail },
      { key: 'usualPaymentForm', control: this.usualPaymentFormControl, initialValue: this.usualPaymentForm},
      { key: 'type', control: this.typeControl, initialValue: this.type },
    ];

    
    const modifiedOwnerAttributes: any = {};
    const modifiedContactAttributes: any = {};
    const modifiedShopAttributes: any = {};
    
    const changesList: any[] = [];

    ownerFieldsToCheck.forEach((field) => {
      if (field.control.value !== field.initialValue) {
        modifiedContactAttributes[field.key] = field.control.value;
        changesList.push({
          attribute: ATTRIBUTE_MAPPING[field.key] || field.key,
          oldValue: field.initialValue,
          newValue: field.control.value,
        });
      }
    });

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

    shopFieldsToCheck.forEach((field) => {
      if (field.control.value !== field.initialValue) {
        modifiedShopAttributes[field.key] = field.control.value;
        changesList.push({
          attribute: ATTRIBUTE_MAPPING[field.key] || field.key,
          oldValue: field.initialValue,
          newValue: field.control.value,
        });
      }
    });

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        text: `<p>¿Seguro que desea efectuar los siguientes cambios en el Comercio <strong>${this.fantasyName}</strong> para el Titular <strong>${this.businessName}</strong>?</p>`,
        changes: changesList,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.patchShop();
      }
    });
  }

}
