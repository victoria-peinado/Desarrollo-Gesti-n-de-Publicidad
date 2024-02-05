import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { MyDataService } from '../services/my-data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Owner } from '../models/owner';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-owner',
  templateUrl: 'owner.component.html',
})
export class OwnerComponent implements OnInit {
  @Input() crud: string = '';
  @Output() completed= new EventEmitter<boolean>();
  @Output() ownerData= new EventEmitter<Owner>();
  owner: Owner | undefined;
  id:any;
  cuit:string='';
  name:string='aaa';
  condition:string=''; 
  isUded:boolean|null=null;
  conditions= [
    'Responsable Inscripto',
    'Consumidor Final',
    'IVA Exento',
    'Monotributista',
    'Sujeto No Categorizado',
    'Exento',
    'Sujeto Extranjero',
    'Agente de Percepción',
    'Agente de Retención',
    'No Alcanzado por IVA',
    'Monotributista Social',
    'Autónomo',
    'Otro'
  ]; //array of the conditions to put in te select input
  

  form: FormGroup;
  formCreate: FormGroup;
  formUpdate: FormGroup;

  constructor(private myDataService: MyDataService, private router: Router, private fb: FormBuilder, private route: ActivatedRoute
    ) {
    this.form = this.fb.group({
      inputCuit: ['',[Validators.required,  Validators.min(0), Validators.pattern("[0-9]*"),Validators.minLength(11),
      Validators.maxLength(11),]]

    })
      this.formCreate = this.fb.group({
      inputName:  ['',[Validators.required]],
      inputCondition: ['',[Validators.required]]

    })
       this.formUpdate = this.fb.group({
      inputName:  ['',[Validators.required]],
      inputCondition: ['',[Validators.required]]

    })
  }
   ngOnInit() {
    this.crud = this.route.snapshot.data['crud'] || this.crud; // this is addes so you can use the router with diferents parameters
  }

//validates tthe cuit
  onCuitChange() {
  if (this.form.get('inputCuit')?.valid&&this.form.get('inputCuit')?.value.length==11) {
    // Llama a la función que deseas ejecutar cuando el CUIT es válido
    //this.cuitValidFunction();
    this.cuit=this.form.get('inputCuit')?.value;
    this.getCuitData();
   }
  }
  //get data of the owner with that cuit
  getCuitData() {
    this.myDataService.getOwnerByCuit(this.cuit).subscribe({
      
      next: (Owner: any) => {
        this.id = Owner.id;
        this.name = Owner.businessName;
        this.condition = Owner.fiscalCondition;
        this.isUded = true;
        this.owner=Owner;
      },
      error: (error: any) => {
        if (error.status == 404) {
          this.isUded = false;
        }
        else {
        console.error('Error: ', error);
        }
      }
    });
  }
  //focus on the next input
  focusNext(next: any): void {
    setTimeout(() => {
      next.click();
    });
  }
  //call the crud owner function
  submit() {
    const owner = new Owner(this.cuit, this.formCreate.get('inputName')?.value, this.formCreate.get('inputCondition')?.value, []);
    if(this.isUded==true){
        if(this.crud=='update'){
          this.updateOwner(owner);
        }
        else if(this.crud=='delete'){
          this.deleteOwner();
        }
      }
      else{
          if(this.crud=='create'){
            this.createOwner(owner);
          }
      }
      this.completed.emit(true);
      this.ownerData.emit(owner);

  }
 //create owner
 createOwner(owner: Owner) {
    this.myDataService.createOwner(owner).subscribe({
      next: (Owner: any) => {
        this.router.navigate(['/owner']);
      },
      error: (error: any) => {
        console.error('Error: ', error);
      }
    });
  }
  //update owner
  updateOwner(owner:Owner) {
    this.myDataService.updateOwner(owner).subscribe({
      next: (Owner: any) => {
        this.router.navigate(['/owner']);
      },
      error: (error: any) => {
        console.error('Error: ', error);
      }
    });
  }
  //delete owner
  deleteOwner() {
    this.myDataService.deleteOwner(this.id).subscribe({
      next: (Owner: any) => {
        this.router.navigate(['/owner']);
      },
      error: (error: any) => {
        console.error('Error: ', error);
      }
    });
  }


}
