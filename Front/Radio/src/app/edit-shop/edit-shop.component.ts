import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Shop } from '../models/shop';
import { MyDataService } from '../services/my-data.service';
import { ThemePalette } from '@angular/material/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit-shop',
  templateUrl: './edit-shop.component.html',
  styleUrls: ['./edit-shop.component.scss']
})
export class EditShopComponent {

  titulo = 'Editar Comercio';
  shop: Shop;
  coloring: ThemePalette = 'primary';
  fantasyNameInvalid: boolean = false;
  message: string = '';
  shopForm: FormGroup;
  showSpinner: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditShopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Shop,
    private _shopService: MyDataService,
    private fb: FormBuilder
  ) {
    // Clonamos los datos del comercio para evitar modificarlos directamente
    this.shop = { ...data };
    this.shopForm = this.fb.group({
      fantasyName: [this.shop.fantasyName, Validators.required],
      address: [this.shop.address, Validators.required],
      billingType: [this.shop.billingType, Validators.required],
      mail: [this.shop.mail, [Validators.required, Validators.email]],
      usualPaymentForm: [this.shop.usualPaymentForm, Validators.required],
      type: [this.shop.type, Validators.required],
    });
  }

  cuit = '';
  fantasyName: string = '';

  cancelar() {
    this.dialogRef.close();
  }

  guardar() {

    this.shop.fantasyName = this.shopForm.get('fantasyName')?.value,
      this.shop.address = this.shopForm.get('address')?.value,
      this.shop.billingType = this.shopForm.get('billingType')?.value,
      this.shop.mail = this.shopForm.get('mail')?.value,
      this.shop.usualPaymentForm = this.shopForm.get('usualPaymentForm')?.value,
      this.shop.type = this.shopForm.get('type')?.value,

      console.log(this.shop)

    this._shopService.updateShop(this.shop).subscribe({
      next: (response: any) => {
        this.showSpinner = false;
        console.log('Comercio actualizado correctamente:', response);
        this.dialogRef.close(this.shop);
      },
      error: (error: any) => {
        this.showSpinner = false;
        console.error('Error al actualizar el comercio:', error);
      }
    });
  }


  alertUser() {
    return '*Este campo es obligatorio.';
  }


  getMailErrorMessage() {
    if (this.shopForm.get('mail')?.hasError('required')) {
      return this.alertUser();
    }

    return this.shopForm.get('mail')?.hasError('email') ? 'Email inválido.' : '';
  }

  alertUserAboutError(mess: string) {
    console.log('')
    this.fantasyNameInvalid = true;
    this.coloring = 'warn';
    this.message = mess;
  }


  verifyNameFantasy() {
    this.showSpinner = true;
    const fantasyNameValue = this.shopForm.get('fantasyName')?.value;
    this._shopService.getShopsByOwnerId(this.shop).subscribe({
        next: (response: any) => {
          const shops: Shop[] = response.data;

          if (shops.some(shop => shop.fantasyName === fantasyNameValue) && fantasyNameValue !== this.shop.fantasyName) {
            this.showSpinner = false;
            this.alertUserAboutError('Nombre de fantasía repetido.');
          } else {
            this.guardar();
          }
        },
        error: (error: any) => {
          this.showSpinner = false;
          console.log(error.message);
          this.alertUserAboutError('Error al verificar el nombre de fantasía.');
        },
      });
  }
}
