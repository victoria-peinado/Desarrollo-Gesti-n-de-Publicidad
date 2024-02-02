import { Component, OnInit,Input } from '@angular/core';
import { MyDataService } from '../services/my-data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Contact } from '../models/contact'; 

@Component({
  selector: 'app-contact',
  templateUrl: 'contact.component.html',
})
export class ContactComponent implements OnInit {
  @Input() crud: string = '';
  id:string='';
  dni:string='';
  name:string='';
  lastname:string=''; 
  isUded:boolean|null=null;


  form: FormGroup;
  formCreate: FormGroup;
  formUpdate: FormGroup;

  constructor(private myDataService: MyDataService, private router: Router, private fb: FormBuilder, private route: ActivatedRoute
    ) {
    this.form = this.fb.group({
      inputDni: ['',[Validators.required,  Validators.min(0), Validators.pattern("[0-9]*"),Validators.minLength(8),
      Validators.maxLength(8),]]

    })
      this.formCreate = this.fb.group({
      inputName:  ['',[Validators.required]],
      inputLastname: ['',[Validators.required]]

    })
       this.formUpdate = this.fb.group({
      inputName:  ['',[Validators.required]],
      inputLAstname: ['',[Validators.required]]

    })
  }
   ngOnInit() {
    this.crud = this.route.snapshot.data['crud'] || this.crud; // this is addes so you can use the router with diferents parameters
  }

//validates tthe dni
  onDniChange() {
  if (this.form.get('inputDni')?.valid&&this.form.get('inputDni')?.value.length==11) {
    // Llama a la función que deseas ejecutar cuando el dni es válido
    this.dni=this.form.get('inputDni')?.value;
    this.getDniData();
   }
  }
  //get data of the contact with that dni
  getDniData() {
    this.myDataService.getContactByDni(this.dni).subscribe({
      
      next: (contact: any) => {
        this.id = contact.id;
        this.name = contact.name;
        this.lastname = contact.lastname;
        this.isUded = true;
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
  //call the crud contact function
  submit() {
    const contact = new Contact(this.dni, this.formCreate.get('inputName')?.value, this.formCreate.get('inputLastname')?.value,[]);
    if(this.isUded==true){
        if(this.crud=='update'){
          this.updateContact(contact);
        }
        else if(this.crud=='delete'){
          this.deleteContact();
        }
      }
      else{
          if(this.crud=='create'){
            this.createContact(contact);
          }
      }

  }
 //create contact
 createContact(contact: Contact) {
    this.myDataService.createContact(contact).subscribe({
      next: (contact: any) => {
        this.router.navigate(['/contact']);
      },
      error: (error: any) => {
        console.error('Error: ', error);
      }
    });
  }
  //update contact
  updateContact(contact:Contact) {
    this.myDataService.updateContact(contact).subscribe({
      next: (conatact: any) => {
        this.router.navigate(['/contact']);
      },
      error: (error: any) => {
        console.error('Error: ', error);
      }
    });
  }
  //delete contact
  deleteContact() {
    this.myDataService.deleteContact(this.id).subscribe({
      next: (contact: any) => {
        this.router.navigate(['/contact']);
      },
      error: (error: any) => {
        console.error('Error: ', error);
      }
    });
  }


}
