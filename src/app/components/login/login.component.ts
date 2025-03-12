import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userForm!: FormGroup;
  isBrowser: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId); // ✅ Ensures SSR compatibility

    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
    }

    // Send login data to server
    this.httpClient.post('https://ecommerce-backend-6pfd.onrender.com/login', this.userForm.value, { responseType: 'text' })
      .subscribe(
        (data: string) => {
          console.log('JWT Token:', data);
          this.saveToken(data); // ✅ Uses safe method to store token
          alert('Login successful');
          this.router.navigate(['/home']);
        },
        (error) => {
          alert('Invalid credentials');
          console.error(error);
        }
      );
  }

  login(): void {
    this.router.navigate(['/register']);
  }

  /**
   * ✅ Safe method to store JWT token (Prevents SSR issues)
   */
  private saveToken(token: string): void {
    if (this.isBrowser) {
      sessionStorage.setItem('jwtToken', token); 
    }
  }
}
