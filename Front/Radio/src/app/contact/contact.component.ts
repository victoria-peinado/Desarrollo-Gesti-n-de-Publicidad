import { Component, OnInit,Input, EventEmitter, Output } from '@angular/core';
import { MyDataService } from '../services/my-data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Contact } from '../models/contact'; 

@Component({
  selector: 'app-contact',
  templateUrl: 'contact.component.html',
})
export class ContactComponent implements OnInit {
  @Input() crud: string = '';
  @Output() completed= new EventEmitter<boolean>();
  @Output() contactData= new EventEmitter<Contact>();
  contact: Contact | undefined;
  id:any;
  dni:string='';
  name:string='';
  lastname:string=''; 
  isUded:boolean|null=false;


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
      inputLastname: ['',[Validators.required]],
      contacts: new FormArray([
        new FormGroup({
          contact : new FormControl('',[Validators.required]) 
        })
      ])

    })
       this.formUpdate = this.fb.group({
      inputName:  ['',[Validators.required]],
      inputLAstname: ['',[Validators.required]],
      contacts:this.fb.array([
        this.fb.group({
          contact :['',[Validators.required]] 
        })
      ]),

    })
  }
   ngOnInit() {
    this.crud = this.route.snapshot.data['crud'] || this.crud; // this is addes so you can use the router with diferents parameters
  }
get contactsCreate() {
  return this.formCreate.get('contacts') as FormArray;
}
get contactsUpdate() {
  return this.formUpdate.get('contacts') as FormArray;
}
//validates tthe dni
  onDniChange() {
  if (this.form.get('inputDni')?.valid&&this.form.get('inputDni')?.value.length==8 ){
  
    this.dni=this.form.get('inputDni')?.value;
    this.getDniData();
   }
  }
  addContactUpdate(){
  this.contactsUpdate.push(this.fb.group({
      contact: ['']
    }));
  }
  addContactCreate(){
  this.contactsCreate.push(this.fb.group({
    contact: ['']
  }));
  }
  removeContactCreate(i:number){
    const d =<FormArray>this.formCreate.get('contacts');
    d.removeAt(i);
  }
  removeContactUpdate(i:number){
    const d =<FormArray>this.formUpdate.get('contacts');
    d.removeAt(i);
  } 
  //get data of the contact with that dni
  getDniData() {
    this.myDataService.getContactByDni(this.dni).subscribe({
      
      next: (contact: Contact) => {
        this.name = contact.name;
        this.lastname = contact.lastname;
        this.isUded = true;
        this.contact=contact;
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
    const contact = new Contact(
      this.dni, 
      this.formCreate.get('inputName')?.value, 
      this.formCreate.get('inputLastname')?.value,
      this.getNonEmptyContactsArray(this.formCreate.value))
    console.log(contact)
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
        this.completed.emit(true);
        this.contactData.emit(contact);
  }
 //create contact
 createContact(contact: Contact) {
    this.myDataService.createContact(contact).subscribe({
      next: (contact: any) => {
         this.contact=contact;
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
         this.contact=contact;
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
         this.contact=contact;
        this.router.navigate(['/contact']);
      },
      error: (error: any) => {
        console.error('Error: ', error);
      }
    });
  }
  prueba(){
    console.log(JSON.stringify(this.formCreate.value, null,2))
  }
  //transform the form value to a array of strings
  getNonEmptyContactsArray(formValue: any): string[] {
  
  const contacts = formValue.contacts || [];

  const nonEmptyContacts = contacts
    .map((contact: { contact: string }) => contact.contact)
    .filter((contact: string) => contact.trim() !== "");

  return nonEmptyContacts;
}

}
