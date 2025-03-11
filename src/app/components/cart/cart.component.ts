import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartItem, CartService } from '../../service/cart.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgFor, CurrencyPipe, NgIf, RouterLink, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  jwtToken: string | null = null;
  cartItems = this.cartService.getCartItems();
  isBrowser: boolean;

  constructor(
    private cartService: CartService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Check platform type
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.jwtToken = this.getToken(); 
  }

  getcartItems() {
    return this.cartItems;
  }

  addToCart(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  removeFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  navigateToCheckout(): void {
    if (this.jwtToken !== null) {
      this.router.navigate(['/checkout']);
    } else {
      alert('Please login to proceed to checkout');
      this.router.navigate(['/login']);
    }
  }

  /**
   * ✅ Safe method to retrieve JWT token (Prevents SSR issues)
   */
  private getToken(): string | null {
    if (!this.isBrowser) {
      return null; // Prevents SSR access errors
    }
    return sessionStorage.getItem('jwtToken') || null;
  }
}
