import {  Component,  ViewChild,  ElementRef,  OnInit,Input, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';

import { MyDataService } from 'src/app/services/my-data.service';
import { FormBuilder, FormGroup, Validators , AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedDataService } from '../../services/shared-data.service';
import { ThemePalette } from '@angular/material/core';
import { Shop } from '../../models/shop.js';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
 
})
export class ShopComponent  {
  @Input() crud: string = '';
  @Input() cuit: string = '';
  @Output() completed= new EventEmitter<boolean>();
  @Output() completedShop= new EventEmitter<Shop>();
  @ViewChild('nombreFantasiaInput', { static: false })
  nombreFantasiaInputRef!: ElementRef;

  Shops: Shop[] = [];
  allShops: Shop[] = [];

  band: boolean = true;
  
  titulo = 'Crear Comercio';
  id: string | null;

  razonSocial: string;
  condicionFinal: string;
  nombreFantasia: string = '';
  coloring: ThemePalette = 'primary';
  nombreFantasiaInvalid: boolean = false;
  isButtonDisabled: boolean = true;
  message: string = '';

  mostrarNuevoComercio = false;
  continuarNuevoComercio = false;

  formCreate: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _ShopService: MyDataService,
    private aRouter: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private cdRef: ChangeDetectorRef
  ) {
    this.formCreate = this.fb.group({
      fantasyName: ['', [Validators.required], [this.verifyNameFantasy.bind(this)]],
      address: ['', Validators.required],
      billingType: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      usualPaymentForm: ['', Validators.required],
      type: ['', Validators.required],
    });

    this.id = this.aRouter.snapshot.paramMap.get('id');

    this.cuit = this.sharedDataService.getCuit();
    this.razonSocial = this.sharedDataService.getbusinessName();
    this.condicionFinal = this.sharedDataService.getfiscalCondition();
  }

  getComercios() {
    if (this.cuit) {
      this._ShopService.getShopsByCuit(this.cuit).subscribe({
        next: (data) => {
          this.allShops = data.slice();
          this.Shops = data;
        },
        error: (error) => {
          console.log(error);
        },
      });
    } else {
      console.error('Cuit no proporcionado.');
    }
  }



  addShop() {
    if (this.cuit) {
      this._ShopService.getOwnerByCuit(this.cuit).subscribe({
        next: (owner: any) => {
          const Shop: Shop = {
            fantasyName: this.formCreate.get('fantasyName')?.value,
            address: this.formCreate.get('address')?.value,
            billingType: this.formCreate.get('billingType')?.value,
            mail: this.formCreate.get('mail')?.value,
            usualPaymentForm: this.formCreate.get('usualPaymentForm')?.value,
            type: this.formCreate.get('type')?.value,
            owner: owner,
            regDate: new Date(),
            contact: '',
            contracts: []
          };

          this.createShop(Shop);
          this.completedShop.emit(Shop);
          this.completed.emit(true);
        },
        error: (error) => {
          console.error(error);
        },
      });
    } else {
      console.error('El CUIT no está definido.');
    }
  }

  createShop(Shop: Shop) {
    this._ShopService.createShop(Shop).subscribe({
      next: (data) => {
        //this.obtenerComercios();
      },
      error: (error) => {
        //console.log(error); caombiar por un pomnpout de error
        this.formCreate.reset();
      },
    });
  }


  verifyNameFantasy(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise((resolve) => {
      const fantasyName = control.value;

      if (fantasyName && this.cuit) {
        this._ShopService
          .getShopsByCuitAndFantasyName(fantasyName, this.cuit)
          .subscribe({
            next: (Shops: Shop[]) => {
              if (Shops && Shops.some((Shop) => Shop.fantasyName === fantasyName)) {
                resolve({ fantasyNameTaken: true });
              } else {
                resolve(null); // Sin error, fantasyName está disponible
              }
            },
            error: (error: any) => {
              console.error('Error en la solicitud:', error);
              resolve(null); // Manejar el error según tus necesidades
            },
          });
      } else {
        console.error('Nombre de fantasía o CUIT no proporcionados.');
        resolve(null); // Sin error, pero podría agregar una validación adicional según tus necesidades
      }
    });
  }

}
