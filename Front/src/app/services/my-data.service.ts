import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Shop } from '../models/shop';
import { Owner } from '../models/owner';
import { Contact } from '../models/contact';
import { User } from '../models/user.js';
import { environment } from 'src/environments/environment';
import { Contract } from '../models/contract.js';
import { HttpParams } from '@angular/common/http';

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
    localStorage.removeItem('user');
    return this.http.get(`${this.apiUrl}auth/logout`);
  } 
  islogged(){
    return !!localStorage.getItem('token');
  }
  getUserRole(){
    return localStorage.getItem('role');
  }
  getUserByUsername(username: string){
    return this.http.get(`${this.apiUrl}auth/byUsername/${username}`);
  }
  updateUser(user: User){
    console.log(user);
    return this.http.patch(`${this.apiUrl}auth/${user.id}`, user);
  }
  deleteUser(user: User){
    return this.http.delete(`${this.apiUrl}auth/${user.id}`);
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
  getLastHistoryByBlock(block: any) : Observable<any> {
    return this.http.get(`${this.apiUrl}price/last/${block.id}`);
  }
  createHistory(history: any) {
    console.log(history);
    return this.http.post(`${this.apiUrl}price`, history);
  }

  getShops(): Observable<any> {
    return this.http.get(`${this.apiUrl}shop`);
  }

  createShop(Shop: Shop): Observable<any> {
    return this.http.post(`${this.apiUrl}shop`, Shop);
  }

  createSpot(spot: any): Observable<any> {
    return this.http.post(`${this.apiUrl}spot`, spot);
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

  createOrder(order: any) {
    return this.http.post(`${this.apiUrl}order`, order);
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

  createContract(contract: Contract) {
    return this.http.post(`${this.apiUrl}contract`, contract);
    
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

  patchContact(contactId: string, contact: any) {
    return this.http.patch(`${this.apiUrl}contact/${contactId}`, contact);
  }

  getContractsByShopId(idShop: string): Observable<any> {return this.http.get(`${this.apiUrl}contract/shop/${idShop}`);}


  
  patchContract( contract: Partial<Contact>): Observable<any> {
    return this.http.patch(`${this.apiUrl}contract/${contract.id}`, contract);
  }
  getOrdersByOwnerCuit(cuit: string): Observable<any> {
    return this.http.get(`${this.apiUrl}order/notPayOrdersByOwnerCuit/${cuit}`);
  }
  getOrdersByShopId(idShop: string): Observable<any> {
    return this.http.get(`${this.apiUrl}order/notPayOrdersByShop/${idShop}`);
  }
 getOrdersByDates(dateFrom: string, dateTo: string): Observable<any> {
  const params = new HttpParams()
    .set('dateFrom', dateFrom)
    .set('dateTo', dateTo);

  return this.http.get(`${this.apiUrl}order/allNotPayOrders`);
  }
  payOrder(orderId: string,data:any): Observable<any> {
    return this.http.patch(`${this.apiUrl}order/registerPayment/${orderId}`, data);
  }
  getODBByDates(dateFrom: string, dateTo: string): Observable<any> {
    const params = new HttpParams()
      .set('dateFrom', dateFrom)
      .set('dateTo', dateTo);

    return this.http.get(`${this.apiUrl}dayorderblock/dates`, { params });
  }
  uploadAudio(audioFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('audio', audioFile, audioFile.name);

  

    return this.http.post(`${this.apiUrl}spot/upload`, formData);
  }
}
