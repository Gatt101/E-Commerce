import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment.production';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from './user.service';

export interface Order {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  viewedAt: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiurl}/orders`;
  private isBrowser: boolean;

  constructor(private http: HttpClient,
    @Inject(PLATFORM_ID)private platformId: object,
    private userService: UserService ) 
  {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

 

getAllOrders(): Observable<Order[]> 
{
  const headers = this.getAuthHeaders();
  if (!headers) return throwError(() => new Error('User is not authenticated'));
  return this.userService.getUser().pipe
  (
    switchMap(user => {
      if (!user || !user.id) 
      {
        return throwError(() => new Error('User ID (MongoDB _id) not found in /me response'));
      }
      console.log(user);
      return this.http.get<Order[]>(`${this.apiUrl}/${user.id}`, { headers });
    }),
    catchError(error => {
      console.error('Error fetching orders:', error);
      return throwError(() => new Error('Failed to fetch orders. Please try again.'));
    })
  );
}

  
  addOrder(order: Order): Observable<Order> 
  {
    const headers = this.getAuthHeaders();
    if (!headers) return throwError(() => new Error('User is not authenticated'));

    return this.http.post<Order>(`${this.apiUrl}/single`, order, { headers }).pipe(
      catchError(error => {
        console.error('Error adding order:', error);
        return throwError(() => new Error('Failed to add order. Please try again.'));
      })
    );
  }

  
  addMultipleOrders(orders: Order[]): Observable<Order[]> 
  {
    const headers = this.getAuthHeaders();
    if (!headers) return throwError(() => new Error('User is not authenticated'));

    return this.http.post<Order[]>(`${this.apiUrl}/multiple`, orders, { headers }).pipe(
      catchError(error => {
        console.error('Error adding multiple orders:', error);
        return throwError(() => new Error('Failed to add multiple orders. Please try again.'));
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
