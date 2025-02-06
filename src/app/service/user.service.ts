import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiurl = `${environment.apiurl}/me`;

  constructor(
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any // Injects platform info
  ) {}

  getUser(): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      console.error('Error: Not running in a browser environment.');
      return throwError(() => new Error('Not running in the browser.'));
    }

    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
      console.error('Error: JWT Token not found in localStorage.');
      return throwError(() => new Error('JWT Token is missing.'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.httpClient.get<any>(this.apiurl, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching user data:', error);
        return throwError(() => new Error('Failed to fetch user data.'));
      })
    );
  }
}
