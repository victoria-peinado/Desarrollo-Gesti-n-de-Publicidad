
import { Component, ViewChild } from '@angular/core';
import { Shop } from 'src/app/models/shop';
import { MatStepper } from '@angular/material/stepper';
import { Owner } from 'src/app/models/owner.js';
import { Contact } from 'src/app/models/contact.js';
@Component({
  selector: 'app-alta-titular-contacto-comercio',
  templateUrl: './alta-titular-contacto-comercio.component.html',
  styleUrls: ['./alta-titular-contacto-comercio.component.scss'],
})
export class NewOwnerContactShopComponent  {
  @ViewChild('stepper') stepper!: MatStepper;
  owner: Owner|undefined;
  contact: Contact|undefined;
  
  completed() {
      if (this.stepper && this.stepper.selected) {
      this.stepper.selected.completed = true;
    }
    console.log('completed'); 
    this.stepper.next();
  } 
  completedOwner(event: Owner|undefined) {
    this.owner = event??undefined;
    console.log(this.owner?.cuit);
  }
  completedContact(event: Contact|undefined) {
    this.contact = event??undefined;
    console.log(this.contact?.dni);
    
  }
  completedShop(event: Shop|undefined) {
    console.log(event);
  }

}
