import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiurl}/Orders`;

  constructor(private http: HttpClient) {}

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl); // Angular's HTTP Interceptor will add JWT token
  }
  addOrder(order: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, order);
  }
}
