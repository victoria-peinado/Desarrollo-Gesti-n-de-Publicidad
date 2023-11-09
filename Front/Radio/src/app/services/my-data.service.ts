import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Trade } from '../models/trade';

@Injectable({
  providedIn: 'root'
})
export class MyDataService {

  urlTrade = 'http://localhost:3000/api/trades/';

  constructor(private http: HttpClient) { }

  getBlocks() {
    return this.http.get('http://localhost:3000/api/blocks');
  }
  createBlock(block:any) {
    return this.http.post('http://localhost:3000/api/blocks', block);
  }
  getHistory() {
    return this.http.get('http://localhost:3000/api/historys');
  }
  createHistory(history:any) {
    return this.http.post('http://localhost:3000/api/historys', history);
  }

  // trade
  getTrades(): Observable<any> {
    return this.http.get(this.urlTrade);
  }

  createTrade(trade: Trade): Observable<any> {
    return this.http.post(this.urlTrade, trade);
  }

  getTrade(id: string): Observable<any> {
    return this.http.get(this.urlTrade + id);
  }

  
  getBillingHolderByCUIT(cuit: string): Observable<any> {
    return this.http.get('http://localhost:3000/api/billingHolders/cuit/' + cuit);
  }


  getTitulares() {
    return this.http.get('http://localhost:3000/api/titulares');
  }

}
