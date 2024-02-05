import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private cuit: string = '';
  private businessName: string = '';
  private fiscalCondition: string = '';

  setCuit(cuit: string) {
    this.cuit = cuit;
  }

  setBusinessName(businessName: string) {
    this.businessName = businessName;
  }

  setFiscalCondition(fiscalCondition: string) {
    this.fiscalCondition = fiscalCondition;
  }

  getCuit(): string {
    return this.cuit;
  }

  getbusinessName(): string {
    return this.businessName;
  }

  getfiscalCondition(): string {
    return this.fiscalCondition;
  }
  
}
