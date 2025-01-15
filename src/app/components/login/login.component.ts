import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userForm!:FormGroup;
  constructor(private formBuilder: FormBuilder,private httpClient:HttpClient, private router: Router ) 
  {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }


  onSubmit(){
    if(this.userForm.valid){
      console.log(this.userForm.value);
    }
    // send data to server
    this.httpClient.post('http://localhost:8080/login', this.userForm.value, { responseType: 'text' })
       .subscribe(
        (data: string) =>
       {
         console.log('JWT Token:', data);
         localStorage.setItem('jwtToken', data);
         this.router.navigate(['/dashboard']); 
       }, (error) => {
        alert('Invalid credentials');
         console.error(error);
       });
  }

}
