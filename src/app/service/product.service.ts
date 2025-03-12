import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private searchQuerySubject = new BehaviorSubject<string>('');
  searchQuery$ = this.searchQuerySubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  apiurl = 'https://fakestoreapi.com/products';
  
  getProducts(): Observable<any> {
    return this.httpClient.get<any>(this.apiurl);
  }

  setSearchQuery(query: string) {
    this.searchQuerySubject.next(query);
  }
}
