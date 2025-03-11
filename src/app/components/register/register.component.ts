import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  userForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient, private router: Router) {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
      // send data to server
      this.httpClient.post('https://e-commerce-alpha-five-96.vercel.app/register', this.userForm.value)
        .subscribe(
          (response) => {
            console.log('Registration successful:', response);
            this.router.navigate(['/home']);
            alert('Registration successful');
          },
          (error) => {
            alert('Registration failed');
            console.error(error);
          }
        );
    }
  }
  login(){
    this.router.navigate(['/login']);
  }
}
