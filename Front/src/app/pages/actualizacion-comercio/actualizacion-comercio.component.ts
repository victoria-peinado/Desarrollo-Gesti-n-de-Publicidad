import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-actualizacion-comercio',
  templateUrl: './actualizacion-comercio.component.html',
  styleUrls: ['./actualizacion-comercio.component.scss']
})
export class ActualizacionComercioComponent {

  updateShopForm: FormGroup;


  constructor (private fb: FormBuilder) {
    this.updateShopForm = this.fb.group({
      cuit: ['', Validators.required],
      fantasyName: ['', Validators.required],
    })
  }

  updateShop() {
    console.log('Hola mundo')
  }


}
