import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDataService } from 'src/app/services/my-data.service';
@Component({
  selector: 'app-consulta-contacto-category',
  templateUrl: './consulta-contacto-category.component.html',
  styleUrl: './consulta-contacto-category.component.scss'
})
export class ConsultaContactoCategoryComponent {
  dni_form: FormGroup;
    errorMessage: string | null = null;
    dni: string = '';
    contactFounded: boolean = false;
    name: string = '';
    lastname: string = '';
    contacts: string = '';
    cargando: boolean = false;

    constructor(private myDataService: MyDataService) {
      this.dni_form = new FormGroup({
        dni: new FormControl('', [
          Validators.required,
          Validators.maxLength(8),
          Validators.minLength(8),
          Validators.pattern(/^[0-9]+$/),
        ])
      });

    }
  
    findContact() {
      this.dni = this.dniControl.value.trim();
  
      if(!this.dni) return;
      this.cargando = true;
      this.myDataService.getContactByDni(this.dni).subscribe({
        next: (response) => {
          this.contactFounded = true;
          this.name = response.data.name;
          this.lastname = response.data.lastname;
          this.contacts = response.data.contacts.join(", ");
          this.errorMessage = null;
        },
        error: () => {
          this.contactFounded = false;
          this.cargando = false;
          this.errorMessage = 'Contacto inexistente.';
        },
      });
    }
  
    get dniControl(): FormControl {
      return this.dni_form.get('dni') as FormControl;
    }

}
