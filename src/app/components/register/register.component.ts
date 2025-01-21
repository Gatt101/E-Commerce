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
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
      // send data to server
      this.httpClient.post('http://localhost:8080/register', this.userForm.value)
        .subscribe(
          (response) => {
            console.log('Registration successful:', response);
            this.router.navigate(['/login']);
          },
          (error) => {
            alert('Registration failed');
            console.error(error);
          }
        );
    }
  }
}
