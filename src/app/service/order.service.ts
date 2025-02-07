import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiurl}/Orders`; // ✅ Correct API endpoint

  constructor(private http: HttpClient) {}

  /** Fetch orders from the backend */
  getOrders(id:number): Observable<any[]> {
    const headers = this.getAuthHeaders(); // Add JWT authentication
    return this.http.get<any[]>(this.apiUrl + `/${id}`, { headers });
  }

  /** Add a new order */
  addOrder(order: any): Observable<any> {
    const headers = this.getAuthHeaders();
  
    
    const requestBody = {
      user: { id: order.user_id },  // ✅ Correct foreign key reference
      productId: order.product_id,
      productName: order.product_name,
      price: order.price,
      quantity: order.quantity,
      viewedAt: order.viewed_at || new Date().toISOString()
    };
  
    console.log("Final Order Payload Sent:", requestBody);
  
    return this.http.post<any>(this.apiUrl, requestBody, { headers });
  }
  

  /** Helper function to get authentication headers */
  private getAuthHeaders(): HttpHeaders {
    const jwtToken = localStorage.getItem('jwtToken'); // ✅ Ensure token is retrieved
    if (!jwtToken) {
      console.error('JWT Token not found in localStorage');
      throw new Error('User is not authenticated');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);
  }
}
