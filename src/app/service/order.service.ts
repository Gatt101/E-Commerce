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

  /** Fetch orders by user ID */
  getOrders(userId: string): Observable<any[]> {
    const headers = this.getAuthHeaders();
    if (!headers) return of([]);

    return this.http.get<any[]>(`${this.apiUrl}/${encodeURIComponent(userId)}`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching orders:', error);
        return throwError(() => error);
      })
    );
  }

  /** Add a single order */
  addOrder(order: any): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return throwError(() => new Error('User is not authenticated'));

    const requestBody = {
      productId: order.productId,
      productName: order.productName,
      price: order.price,
      userId: order.userId,
      viewedAt: order.viewedAt || new Date().toISOString()
    };

    return this.http.post<any>(this.apiUrl, requestBody, { headers }).pipe(
      catchError(error => {
        console.error('Error adding order:', error);
        return throwError(() => error);
      })
    );
  }

  /** Add multiple orders */
  addMultipleOrders(orders: any[]): Observable<any[]> {
    const headers = this.getAuthHeaders();
    if (!headers) return throwError(() => new Error('User is not authenticated'));

    const requestBody = orders.map(order => ({
      productId: order.productId,
      productName: order.productName,
      price: order.price,
      userId: order.userId,
      viewedAt: order.viewedAt || new Date().toISOString()
    }));

    return this.http.post<any[]>(`${this.apiUrl}/multiple`, requestBody, { headers }).pipe(
      catchError(error => {
        console.error('Error adding multiple orders:', error);
        return throwError(() => error);
      })
    );
  }

  /** Helper function to get authentication headers */
  private getAuthHeaders(): HttpHeaders | null {
    if (!this.isBrowser) {
      console.warn('Skipping authentication headers: Running in SSR mode.');
      return null;
    }

    const jwtToken = this.getToken();
    if (!jwtToken) {
      console.error('JWT Token not found in sessionStorage');
      return null;
    }

    return new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);
  }

  /** Retrieve JWT token safely */
  private getToken(): string | null {
    if (!this.isBrowser) return null;
    return sessionStorage.getItem('jwtToken') || null;
  }
}
