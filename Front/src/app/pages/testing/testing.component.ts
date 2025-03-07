import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, inject, SimpleChange, TrackByFunction } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';

export interface Contact {
  num_email: string;
}

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrl: './testing.component.scss',
})
export class TestingComponent {
addOnBlur = true;
   readonly separatorKeysCodes = [ENTER, COMMA] as const;
   contacts: Contact[] = [];
 
   announcer = inject(LiveAnnouncer);
   contacts_form = new FormGroup({
     contact: new FormControl('', [Validators.required, Validators.pattern(/^(?:(?:00)?549?)?0?(?:11|[2368]\d{1,3})\d{6,7}$/)])
   });
 
 
   ngOnInit(): void {

     this.contacts_form.get('contact')?.valueChanges.subscribe((value) => {
 
       if (!value || value === '') {
         this.onInputEmpty();
       }
     });
   }
 
   onInputEmpty(): void {
    console.log('pasó por onInputEmpty');

    if (this.contacts.length !== 0) {
        setTimeout(() => {
            const contactControl = this.contacts_form.controls.contact;
            contactControl.markAsDirty();
            contactControl.setErrors({ pattern: true }); // 🔥 Marca el error de patrón manualmente
        });
    }
}



   add(event: MatChipInputEvent): void {
    console.log("pasó por add")
    const value = (event.value || '');
    console.log("value: ", value);
    const contactControl = this.contacts_form.get('contact');

    if (value && contactControl?.valid) {
      console.log('add: value && contactContorl?valid')
      this.contacts.push({ num_email: value });
    } else {
      console.log("else")

      contactControl?.markAsDirty();
         contactControl?.markAsTouched();
         contactControl?.setValue('');

      setTimeout(() => {
        contactControl?.markAsDirty();
         contactControl?.markAsTouched();
         contactControl?.setValue('');

      });
    }

    event.chipInput!.clear();

  }




 
   remove(contact: Contact): void {
     const index = this.contacts.indexOf(contact);
     if (index >= 0) {
       this.contacts.splice(index, 1);
       this.announcer.announce(`Removed ${contact.num_email}`);
     }
 
     if (this.contacts.length === 0) {
       this.contacts_form.controls.contact.markAsDirty();
         this.contacts_form.controls.contact.markAsTouched();
         this.contacts_form.controls.contact.setValue('');
     }
   }
   
   edit(contact: Contact, event: MatChipEditedEvent) {
     const value = event.value;
     if (!value) {
       this.remove(contact);
       return;
     }
     const index = this.contacts.indexOf(contact);
     if (index >= 0) {
       this.contacts[index].num_email = value;
     }
   }
}