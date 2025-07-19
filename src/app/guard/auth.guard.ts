import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // ✅ Ensure sessionStorage is accessed only in the browser
  const isBrowser = typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
  const token = isBrowser ? sessionStorage.getItem('jwtToken') : null;

  if (token) {
    // console.log('AuthGuard executed. Token found:', token);
    return true;
  } else {
    // console.log('AuthGuard executed. No token found.');

    if (isBrowser) {
      alert('Please Login first to Purchase'); // ✅ Only runs in the browser
      router.navigate(['/login']);
    } else {
      // console.warn('Skipping alert and navigation: Running in SSR mode.');
    }

    return false;
  }
};
