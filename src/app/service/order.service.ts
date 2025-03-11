import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiurl}/Orders`; 
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /** ✅ Fetch orders from the backend */
  getOrders(id: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    if (!headers) return of([]); // ✅ Prevents errors in SSR mode (Returns empty array)

    return this.http.get<any[]>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching orders:', error);
        return throwError(() => error);
      })
    );
  }

  /** ✅ Add a new order */
  addOrder(order: any): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return throwError(() => new Error('User is not authenticated'));

    const requestBody = {
      user: { id: order.user_id },  
      productId: order.product_id,
      productName: order.product_name,
      price: order.price,
      quantity: order.quantity,
      viewedAt: order.viewed_at || new Date().toISOString()
    };

    console.log("Final Order Payload Sent:", requestBody);

    return this.http.post<any>(this.apiUrl, requestBody, { headers }).pipe(
      catchError(error => {
        console.error('Error adding order:', error);
        return throwError(() => error);
      })
    );
  }

  /** ✅ Add multiple orders */
  addMultipleOrders(orders: any[]): Observable<any[]> {
    const newApiUrl = `${this.apiUrl}/multiple`;
    const headers = this.getAuthHeaders();
    if (!headers) return throwError(() => new Error('User is not authenticated'));

    console.log("Final Order Payload Sent:", orders);
    const requestBody = orders.map(order => ({
      user: { id: order.user_id },
      productId: order.product_id,
      productName: order.product_name,
      price: order.price,
      quantity: order.quantity,
      viewedAt: order.viewed_at || new Date().toISOString()
    }));

    return this.http.post<any[]>(newApiUrl, requestBody, { headers }).pipe(
      catchError(error => {
        console.error('Error adding multiple orders:', error);
        return throwError(() => error);
      })
    );
  }

  /** ✅ Helper function to get authentication headers safely */
  private getAuthHeaders(): HttpHeaders | null {
    if (!this.isBrowser) {
      console.warn('Skipping authentication headers: Running in SSR mode.');
      return null; // ✅ Prevents SSR crashes
    }

    const jwtToken = this.getToken();
    if (!jwtToken) {
      console.error('JWT Token not found in sessionStorage');
      return null; // ✅ Prevents request from executing without auth
    }

    return new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);
  }

  /** ✅ Safe method to retrieve JWT token (Only in browser) */
  private getToken(): string | null {
    if (!this.isBrowser) return null; // ✅ Prevents SSR access issues
    return sessionStorage.getItem('jwtToken') || null; 
  }
}
