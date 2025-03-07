import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { EventEmitter, Component, inject, Output, SimpleChange, TrackByFunction, ViewChild, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-input-contacts',
  templateUrl: './input-contacts.component.html',
  styleUrl: './input-contacts.component.scss'
})
export class InputContactsComponent {
 addOnBlur = true;
   readonly separatorKeysCodes = [ENTER, COMMA] as const;


   @Output() contactsChange: EventEmitter<string[]> = new EventEmitter<string[]>();
   
   @ViewChild(FormGroupDirective) formDirective: FormGroupDirective | undefined;

   @Input() contacts: string[] = [];
   @Input() disabled: boolean = false;
 
   announcer = inject(LiveAnnouncer);
   contacts_form = new FormGroup({
     contact: new FormControl({ value: '', disabled: false }, [Validators.required])
   });

   private emitContacts(): void {
    this.contactsChange.emit(this.contacts);
  }

 clearForm() {
    this.formDirective?.resetForm({
      contact: ''});
    this.contacts = [];
  }

  disableForm() {
    this.contacts_form.get('contact')?.disable();
  }
  
  enableForm() {
    this.contacts_form.get('contact')?.enable();
  }
 
   ngOnInit(): void {
     this.contacts_form.get('contact')?.valueChanges.subscribe((value) => {
 
       if (!value || value.trim() === '') {
         this.onInputEmpty();
       }
     });
   }
 
   onInputEmpty(): void {
     if(this.contacts.length!=0){
 
     
     console.log('vacío')
     setTimeout(() => {
       this.contacts_form.controls.contact.markAsPristine();
       this.contacts_form.controls.contact.markAsUntouched(); 
     });
   }
   }
 
   add(event: MatChipInputEvent): void {
     const value = (event.value || '').trim();
 
     if (value) {
       this.contacts.push(value);
       this.emitContacts();
     }
 
     setTimeout(() => {
       this.contacts_form.controls.contact.markAsPristine();
       this.contacts_form.controls.contact.markAsUntouched(); 
     });
 
     event.chipInput!.clear();
 
     setTimeout(() => {
       this.contacts_form.controls.contact.markAsPristine();
       this.contacts_form.controls.contact.markAsUntouched(); 
     });
   }
 
   remove(contact: string): void {
     const index = this.contacts.indexOf(contact);
     if (index >= 0) {
       this.contacts.splice(index, 1);
       this.emitContacts();
       this.announcer.announce(`Removed ${contact}`);
     }
 
     if (this.contacts.length === 0) {
       this.contacts_form.controls.contact.markAsDirty();
         this.contacts_form.controls.contact.markAsTouched();
         this.contacts_form.controls.contact.setValue('');
     }
   }
   
   edit(contact: string, event: MatChipEditedEvent) {
     const value = event.value.trim();
     if (!value) {
       this.remove(contact);
       return;
     }
     const index = this.contacts.indexOf(contact);
     if (index >= 0) {
       this.contacts[index] = value;
       this.emitContacts();
     }

   }
}