import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDataService } from 'src/app/services/my-data.service';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-consulta-titular-category',
  templateUrl: './consulta-titular-category.component.html',
  styleUrl: './consulta-titular-category.component.scss'
})
export class ConsultaTitularCategoryComponent {
  
    cuit_form: FormGroup;
    errorMessage: string | null = null;
    cuit: string = '';
    ownerFounded: boolean = false;
    bussinessName: string = '';
    fiscalCondition: string = '';
    cargando: boolean = false;

    constructor(private myDataService: MyDataService, private sharedDataService: SharedDataService
    ) {
      this.cuit_form = new FormGroup({
        cuit: new FormControl('', [
          Validators.required,
          Validators.maxLength(11),
          Validators.minLength(11),
          Validators.pattern(/^[0-9]+$/),
          sharedDataService.verifyCuit()
        ])
      });

    }
  
    findOwner() {
      this.cuit = this.cuitControl.value.trim();
  
      if(!this.cuit) return;
      this.cargando = true;
      this.myDataService.getOwnerByCuit(this.cuit).subscribe({
        next: (response) => {
          this.ownerFounded = true;
          this.bussinessName = response.data.businessName;
          this.fiscalCondition = response.data.fiscalCondition;
          this.errorMessage = null;
        },
        error: () => {
          this.ownerFounded = false;
          this.cargando = false;
          this.errorMessage = 'Titular inexistente.';
        },
      });
    }
  
    get cuitControl(): FormControl {
      return this.cuit_form.get('cuit') as FormControl;
    }
  
}
