import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Trade } from '../models/trade';

@Injectable({
  providedIn: 'root'
})
export class MyDataService {

  url = 'http://localhost:3000/api/trades/';

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
    return this.http.get(this.url);
  }

  saveTrade(trade: Trade): Observable<any> {
    return this.http.post(this.url, trade);
  }

  getTrade(id: string): Observable<any> {
    return this.http.get(this.url + id);
  }

}
