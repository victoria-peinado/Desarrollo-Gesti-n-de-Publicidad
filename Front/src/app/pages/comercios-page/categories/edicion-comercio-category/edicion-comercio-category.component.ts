import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edicion-comercio-category',
  templateUrl: './edicion-comercio-category.component.html',
  styleUrl: './edicion-comercio-category.component.scss'
})
export class EdicionComercioCategoryComponent {
  titular_form: FormGroup;

  constructor() {
    this.titular_form = new FormGroup({
      cuit: new FormControl('', [Validators.required, Validators.maxLength(11),Validators.minLength(11),]),
      comercio: new FormControl('', Validators.required)
    });
  }

  siguiente() {
    console.log(this.titular_form.value);
  }

  get cuitControl(): FormControl {
    return this.titular_form.get('cuit') as FormControl;
  }
  
  get comercioControl(): FormControl {
    return this.titular_form.get('comercio') as FormControl;
  }
}
