import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient:HttpClient) { }

  // apiurl='https://fakestoreapi.com/products';
  apiurl= 'https://dummyjson.com/products';
  getProducts():Observable<any>{
    return this.httpClient.get<any>(this.apiurl);
  }
}
