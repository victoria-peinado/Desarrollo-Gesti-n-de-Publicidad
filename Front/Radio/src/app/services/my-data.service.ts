import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Shop } from '../models/shop';
import { Owner } from '../models/owner';
import { Contact } from '../models/contact';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MyDataService {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getBlocks() {
    return this.http.get(`${this.apiUrl}block`);
  }
  createBlock(block:any) {
    return this.http.post(`${this.apiUrl}block`, block);
  }
  getHistory() {
    return this.http.get(`${this.apiUrl}price`);
  }
  createHistory(history:any) {
    return this.http.post(`${this.apiUrl}price`, history);
  }

  getShops(): Observable<any> {
    return this.http.get(`${this.apiUrl}shop`);
  }

  createShop(Shop: Shop): Observable<any> {
    return this.http.post(`${this.apiUrl}shop`, Shop);
  }

  getShop(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}shop/${id}`);
  }

  getShopsByCuit(cuit: string): Observable<any> {
    return this.http.get(`${this.apiUrl}shop/${cuit}`);
  }
  
  getOwnerByCuit(cuit: string): Observable<any> {
    return this.http.get(`${this.apiUrl}owner/cuit/${cuit}`);
  }


  getShopsByCuitAndFantasyName(fantasyName: string, cuit: string): Observable<any> {
    return this.http.get(`${this.apiUrl}shop/search?fantasyName=${fantasyName}&cuit=${cuit}`);
  }
 
  // Servicio myDataService
  deleteOwner(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}owner/${id}`);
}
  createOwner(owner: Owner) {
    return this.http.post(`${this.apiUrl}owner`, owner);
  }
  updateOwner(owner: Owner) {
    return this.http.put(`${this.apiUrl}owner`, owner);
  }

  getContactByDni(dni: string): Observable<any> {
    return this.http.get(`${this.apiUrl}contact/dni/${dni}`);
  }
  deleteContact(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}contact/${id}`);
}
  createContact(contact: Contact) {
    return this.http.post(`${this.apiUrl}contact`, contact);
  }
  updateContact(contact: Contact) {
    return this.http.put(`${this.apiUrl}contact`, contact);
  }


}
