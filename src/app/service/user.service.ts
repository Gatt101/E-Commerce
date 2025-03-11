import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiurl = `${environment.apiurl}/me`;
  private isBrowser: boolean;

  constructor(
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * ✅ Fetches user data (Only in browser mode)
   */
  getUser(): Observable<any> {
    if (!this.isBrowser) {
      console.warn('Skipping getUser(): Running in SSR mode.');
      return of(null); // ✅ Prevents SSR crashes
    }

    const jwtToken = this.getToken();
    if (!jwtToken) {
      console.warn('JWT Token not found in browser storage.');
      return of(null); // ✅ Prevents UI from breaking
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.httpClient.get<any>(this.apiurl, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching user data:', error);
        return throwError(() => new Error('Failed to fetch user data.'));
      })
    );
  }

  /**
   * ✅ Retrieves JWT token safely (Only in browser mode)
   */
  private getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null; // ✅ Prevents SSR access
    }

    return window.sessionStorage.getItem('jwtToken') || null;
  }
}
