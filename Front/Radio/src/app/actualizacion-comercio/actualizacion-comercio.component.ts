import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-actualizacion-comercio',
  templateUrl: './actualizacion-comercio.component.html',
  styleUrls: ['./actualizacion-comercio.component.scss']
})
export class ActualizacionComercioComponent {

  updateTradeForm: FormGroup;


  constructor (private fb: FormBuilder) {
    this.updateTradeForm = this.fb.group({
      CUIT: ['', Validators.required],
      fantasyName: ['', Validators.required],
    })
  }

  updateTrade() {
    console.log('Hola mundo')
  }


}
