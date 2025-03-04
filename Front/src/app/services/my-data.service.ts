import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Shop } from '../models/shop';
import { Owner } from '../models/owner';
import { Contact } from '../models/contact';
import { User } from '../models/user.js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MyDataService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(user: User){
    return this.http.post(`${this.apiUrl}auth/register`, user);
  }
  login(user: User){
    return this.http.post(`${this.apiUrl}auth/login`, user);
  }
  logout(){
    localStorage.removeItem('token');
    return this.http.get(`${this.apiUrl}auth/logout`);
  } 
  islogged(){
    return !!localStorage.getItem('token');
  }

  getBlocks() {
    return this.http.get(`${this.apiUrl}block`);
  }
  createBlock(block: any) {
    return this.http.post(`${this.apiUrl}block`, block);
  }
  getHistory() {
    return this.http.get(`${this.apiUrl}price`);
  }
  createHistory(history: any) {
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

  getShopsByOwnerId(shop: Shop): Observable<any> {
    return this.http.get(`${this.apiUrl}shop/owner/${shop.owner}`);
  }

  updateShop(shop: Shop): Observable<any> {
    return this.http.put(`${this.apiUrl}shop/${shop.id}`, shop);
  }

  deleteShop(shop: Shop): Observable<any> {
    return this.http.delete(`${this.apiUrl}shop/${shop.id}`);
  }

  getOwnerByCuit(cuit: string): Observable<any> {
    return this.http.get(`${this.apiUrl}owner/cuit/${cuit}`);
  }

  getShopsByCuitAndFantasyName(
    fantasyName: string,
    cuit: string
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}shop/search?fantasyName=${fantasyName}&cuit=${cuit}`
    );
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

  getOrderById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}order/${id}`);
  }

  getContractById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}contract/${id}`);
  }

  getOwnerById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}owner/${id}`);
  }

  patchShop(id: string, shop: Partial<Shop>): Observable<any> {
    return this.http.patch(`${this.apiUrl}shop/${id}`, shop);
  }

  patchOwner(ownerId: string, owner: any) {
    return this.http.patch(`${this.apiUrl}owner/${ownerId}`, owner);
  }

  patchContact(contactId: string, contactData: any) {
    return this.http.patch(`${this.apiUrl}contact/${contactId}`, contactData);
  }
}
