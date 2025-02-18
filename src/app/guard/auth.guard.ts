import { CanActivateFn,Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('jwtToken'); // Check for JWT token

  if (token) {
    console.log('AuthGuard executed token: ' + token);
    return true;
  } 
  else{
    console.log('AuthGuard executed');
   alert('Please Login first to Purchase');
    const router = inject(Router);
    router.navigate(['/login']);
    return false;
  }

};
