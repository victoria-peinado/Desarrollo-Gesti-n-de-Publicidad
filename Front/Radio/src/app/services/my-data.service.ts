import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyDataService {

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
}
