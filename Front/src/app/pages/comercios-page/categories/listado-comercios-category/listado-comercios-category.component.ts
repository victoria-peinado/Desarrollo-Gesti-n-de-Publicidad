import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Shop } from 'src/app/models/shop';
import { MyDataService } from 'src/app/services/my-data.service';

@Component({
  selector: 'app-listado-comercios-category',
  templateUrl: './listado-comercios-category.component.html',
  styleUrl: './listado-comercios-category.component.scss',
})
export class ListadoComerciosCategoryComponent {
  owner_form: FormGroup;
  cuit: string = '';
  ownerFounded: boolean = false;
  shops: Shop[] = [];
  errorMessageOwner: string | null = null;

  constructor(private myDataService: MyDataService) {
    this.owner_form = new FormGroup({
      cuit: new FormControl('', [
        Validators.required,
        Validators.maxLength(11),
        Validators.minLength(11),
        Validators.pattern(/^[0-9]+$/),
      ]),
    });
  }

  get cuitControl(): FormControl {
    return this.owner_form.get('cuit') as FormControl;
  }


  findOwner() {
    this.cuit = this.cuitControl.value.trim();

    if (!this.cuit) return;

    this.myDataService.getOwnerByCuit(this.cuit).subscribe({
      next: (response: any) => {
        this.ownerFounded = true;
        this.errorMessageOwner = null;
        this.shops = response.data.shops;
        console.log(this.shops);
      },
      error: () => {
        this.ownerFounded = false;
        this.errorMessageOwner = 'Titular inexistente.';
      },
    });
  }


}
