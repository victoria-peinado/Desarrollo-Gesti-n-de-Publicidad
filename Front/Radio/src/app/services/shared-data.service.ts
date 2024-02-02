import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private cuit: string = '';
  private razonSocial: string = '';
  private condicionFinal: string = '';

  setCuit(cuit: string) {
    this.cuit = cuit;
  }

  setRazonSocial(razonSocial: string) {
    this.razonSocial = razonSocial;
  }

  setCondicionFinal(condicionFinal: string) {
    this.condicionFinal = condicionFinal;
  }

  getCuit(): string {
    return this.cuit;
  }

  getRazonSocial(): string {
    return this.razonSocial;
  }

  getCondicionFinal(): string {
    return this.condicionFinal;
  }
  
}
