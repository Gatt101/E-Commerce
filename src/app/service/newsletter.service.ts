import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private apiUrl = 'http://localhost:8080/newsletter'; // Update with your backend URL

  constructor(private http: HttpClient) { }

  subscribe(email: string) {
    return this.http.post(this.apiUrl, { email });
  }
} 