import { Component, ViewChild, ElementRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core/index.js';
import { Router } from '@angular/router';
import { MyDataService } from 'src/app/services/my-data.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { SharedDataService } from '../services/shared-data.service';

import { Owner } from '../models/owner.js';

@Component({
  selector: 'app-alta-comercio',
  templateUrl: './alta-comercio.component.html',
  styleUrls: ['./alta-comercio.component.scss'],
})
export class AltaComercioComponent {
  owner: Owner | undefined;
  id: any;
  cuit: string = '';
  name: string = '';
  condition: string = '';
  isUded: boolean | null = null;

  form: FormGroup;

  constructor(
    private myDataService: MyDataService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      inputCuit: [
        '',
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern('[0-9]*'),
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
    });
  }

  //validates tthe cuit
  onCuitChange() {
    if (
      this.form.get('inputCuit')?.valid &&
      this.form.get('inputCuit')?.value.length == 11
    ) {
      // Llama a la función que deseas ejecutar cuando el CUIT es válido
      //this.cuitValidFunction();
      this.cuit = this.form.get('inputCuit')?.value;
      this.getCuitData();
    }
  }
  //get data of the owner with that cuit
  getCuitData() {
    this.myDataService.getOwnerByCuit(this.cuit).subscribe({
      next: (response: any) => {
        const owner: Owner = response.data;
        this.id = owner.id;
        this.name = owner.businessName;
        this.condition = owner.fiscalCondition;
        this.isUded = true;
        this.owner = owner;
      },
      error: (error: any) => {
        if (error.status == 404) {
          this.isUded = false;
        } else {
          console.error('Error: ', error);
        }
      },
    });
    console.log(this.owner);
  }
}
