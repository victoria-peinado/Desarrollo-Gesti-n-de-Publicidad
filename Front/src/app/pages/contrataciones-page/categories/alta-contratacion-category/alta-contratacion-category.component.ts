import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-alta-contratacion-category',
  templateUrl: './alta-contratacion-category.component.html',
  styleUrl: './alta-contratacion-category.component.scss'
})
export class AltaContratacionCategoryComponent {

  list_form: FormGroup;
      constructor() {
        this.list_form = new FormGroup({
          dateFrom: new FormControl('', Validators.required),
          dateTo: new FormControl('', Validators.required),
        });

      }


      get dateFromControl(): FormControl {
        return this.list_form.get('dateFrom') as FormControl;
      }
    
      get dateToControl(): FormControl {
        return this.list_form.get('dateTo') as FormControl;
      }

}
