import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BILLING_TYPES, SHOP_TYPES, USUAL_PAYMENT_FORMS } from 'src/app/constants/constants';
import { Shop } from 'src/app/models/shop';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MyDataService } from 'src/app/services/my-data.service';

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
      dni: new FormControl('', [Validators.required, Validators.minLength(8)]),
      contactMail: new FormControl('', [Validators.required, Validators.email]),
    });

    // Escuchar cambios en el CUIT
    
  }


  buscarTitular() {


    this.cuit = this.cuitControl.value.trim();

    if(!this.cuit) return;

    this.myDataService.getOwnerByCuit(this.cuit).subscribe({
      next: (response: any) => {
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

        console.log(shop)
      
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
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          text: `<p>¿Seguro que desea actualizar el Spot de la Orden?</p>`,
        },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
      });
    }
  
}
