import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
      console.error('localStorage is not available (Not running in the browser)');
      return new Observable();
    }

    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
      console.error('JWT Token not found in localStorage');
      return new Observable();
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);
    return this.httpClient.get<any>(this.apiurl, { headers });
  }
}
