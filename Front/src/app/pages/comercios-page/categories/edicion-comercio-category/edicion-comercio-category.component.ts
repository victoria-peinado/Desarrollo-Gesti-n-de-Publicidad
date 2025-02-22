import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BILLING_TYPES, SHOP_TYPES, USUAL_PAYMENT_FORMS } from 'src/app/constants/constants';
import { Shop } from 'src/app/models/shop';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MyDataService } from 'src/app/services/my-data.service';
import { ATTRIBUTE_MAPPING } from 'src/app/constants/attribute-mapping';

@Component({
  selector: 'app-edicion-comercio-category',
  templateUrl: './edicion-comercio-category.component.html',
  styleUrl: './edicion-comercio-category.component.scss',
})
export class EdicionComercioCategoryComponent {
  titular_form: FormGroup;
  shop_form: FormGroup;
  contact_form: FormGroup;
  shops: any[] = [];
  errorMessage: string | null = null;
  cuit: string = '';
  comercios: string[] = [];
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
  bussinessName: string = '';

  billingTypes: string[] = BILLING_TYPES;
  usualPaymentForms: string[] = USUAL_PAYMENT_FORMS;
  shopTypes: string[] = SHOP_TYPES;
  
  constructor(public dialog: MatDialog, private myDataService: MyDataService) {
    this.titular_form = new FormGroup({
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

    this.shop_form = new FormGroup({
      fantasyName: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      billingType: new FormControl('', Validators.required),
      mail: new FormControl('', [Validators.required, Validators.email]),
      usualPaymentForm: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
    });

    this.contact_form = new FormGroup({
      name: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      dni: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
    });

    // Escuchar cambios en el CUIT
    
  }


  buscarTitular() {


    this.cuit = this.cuitControl.value.trim();

    if(!this.cuit) return;

    this.myDataService.getOwnerByCuit(this.cuit).subscribe({
      next: (response: any) => {
        this.bussinessName = response.data.businessName;
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
        this.comercioControl.setValue('');
        this.comercioControl.disable();
        this.errorMessage = 'Titular inexistente.';
      },
    });
  }

  siguiente() {
    const shop = this.shops.find(
      (s) => s.fantasyName === this.comercioControl.value
    );

    if (shop) {

        this.fantasyName = shop.fantasyName;
        this.address = shop.address;
        this.billingType = shop.billingType;
        this.mail = shop.mail;
        this.usualPaymentForm = shop.usualPaymentForm;
        this.type = shop.type;

        this.fantasyNameControl.setValue(this.fantasyName);
        this.addressControl.setValue(this.address);
        this.billingTypeControl.setValue(this.billingType);
        this.mailControl.setValue(this.mail);
        this.usualPaymentFormControl.setValue(this.usualPaymentForm);
        this.typeControl.setValue(this.type);

        this.name = shop.contact.name;
        this.lastname = shop.contact.lastname;
        this.dni = shop.contact.dni;

        this.nameControl.setValue(this.name);
        this.lastnameControl.setValue(this.lastname);
        this.dniControl.setValue(this.dni);

        this.shopFounded = true;
      };

      
      
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
    return this.titular_form.get('cuit') as FormControl;
  }

  get comercioControl(): FormControl {
    return this.titular_form.get('comercio') as FormControl;
  }

  openDialog(): void {
    const shopFieldsToCheck = [
      { key: 'fantasyName', control: this.fantasyNameControl, initialValue: this.fantasyName },
      { key: 'address', control: this.addressControl, initialValue: this.address },
      { key: 'billingType', control: this.billingTypeControl, initialValue: this.billingType },
      { key: 'mail', control: this.mailControl, initialValue: this.mail },
      { key: 'usualPaymentForm', control: this.usualPaymentFormControl, initialValue: this.usualPaymentForm },
      { key: 'type', control: this.typeControl, initialValue: this.type },
    ];
  
    const contactFieldsToCheck = [
      { key: 'name', control: this.nameControl, initialValue: this.name },
      { key: 'lastname', control: this.lastnameControl, initialValue: this.lastname },
      { key: 'dni', control: this.dniControl, initialValue: this.dni },
    ];

    const modifiedShopAttributes: any = {};
  const modifiedContactAttributes: any = {};
  const changesList: any[] = [];
  
    shopFieldsToCheck.forEach(field => {
      if (field.control.value !== field.initialValue) {
        modifiedShopAttributes[field.key] = field.control.value;
        changesList.push({
          attribute: ATTRIBUTE_MAPPING[field.key] || field.key,
          oldValue: field.initialValue,
          newValue: field.control.value,
        });
      }
    });

    contactFieldsToCheck.forEach(field => {
      if (field.control.value !== field.initialValue) {
        modifiedContactAttributes[field.key] = field.control.value;
        changesList.push({
          attribute: ATTRIBUTE_MAPPING[field.key] || field.key,
          oldValue: field.initialValue,
          newValue: field.control.value,
        });
      }
    });

    if (changesList.length === 0) {
      console.log('No hay cambios para actualizar.');
      return;
    }
  
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        text: `<p>¿Seguro que desea efectuar los siguientes cambios en el Comercio <strong>${this.fantasyName}</strong> para el Titular <strong>${this.bussinessName}</strong>?</p>`,
        changes: changesList,
      },
    });

  
    dialogRef.afterClosed().subscribe(result => {
      if (result && this.shopFounded) {
        const shop = this.shops.find(shop => shop.fantasyName === this.fantasyName);
        if (!shop) return;
  
        const shopId = shop.id;
        const contactId = shop.contact?.id; 
  
        console.log(modifiedShopAttributes)
        if (Object.keys(modifiedShopAttributes).length > 0) {
          this.myDataService.patchShop(shopId, modifiedShopAttributes).subscribe({
            next: () => console.log('Comercio actualizado exitosamente'),
            error: (err) => console.error('Error al actualizar comercio:', err),
          });
        }
  
        console.log(modifiedContactAttributes)
        if (Object.keys(modifiedContactAttributes).length > 0 && contactId) {
          this.myDataService.patchContact(contactId, modifiedContactAttributes).subscribe({
            next: () => console.log('Contacto actualizado exitosamente'),
            error: (err) => console.error('Error al actualizar contacto:', err),
          });
        }
      }
    });
  }
}
