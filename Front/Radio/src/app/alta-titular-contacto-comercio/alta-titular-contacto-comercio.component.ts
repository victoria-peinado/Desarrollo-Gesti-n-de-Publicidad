import {  Component,  ViewChild} from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { BillingHolder } from '../models/billing-holder';
import { Contact } from '../models/contact';
import { Trade } from '../models/trade'
@Component({
  selector: 'app-alta-titular-contacto-comercio',
  templateUrl: './alta-titular-contacto-comercio.component.html',
  styleUrls: ['./alta-titular-contacto-comercio.component.scss'],
})
export class NewOwnerContactShopComponent  {
  @ViewChild('stepper') stepper!: MatStepper;
  owner: BillingHolder|undefined;
  contact: Contact|undefined;
  
  completed() {
      if (this.stepper && this.stepper.selected) {
      this.stepper.selected.completed = true;
    }
    console.log('completed'); 
    this.stepper.next();
  } 
  completedOwner(event: BillingHolder|undefined) {
    this.owner = event??undefined;
    console.log(this.owner?.cuit);
  }
  completedContact(event: Contact|undefined) {
    this.contact = event??undefined;
    console.log(this.contact?.dni);
    
  }
  completedShop(event: Trade|undefined) {
    console.log(event);
  }

}
