import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { CartItem, CartService } from '../../service/cart.service';
import { CheckoutComponent } from '../checkout/checkout.component';
import { CartComponent } from '../cart/cart.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgFor, CurrencyPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  products: any[] = [];
  jwtToken: string | null = null; // ✅ Ensure initialization

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    // ✅ Ensure the product list is always fetched
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });

    // ✅ Fix localStorage check for SSR
    if (typeof window !== 'undefined' && window.localStorage) {
      this.jwtToken = localStorage.getItem('jwtToken');
    }
  }

  addToCart(item: CartItem): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.cartService.addToCart(item);
    } else {
      console.error('localStorage is not available');
    }
  }

  buyNow(item: CartItem): void {
    if (this.jwtToken !== null) {
      if (typeof window !== 'undefined' && window.localStorage) {
        this.cartService.buyNow(item);
        this.router.navigate(['/checkout']);
      } else {
        console.error('localStorage is not available');
      }
    } else {
      alert('Please login to continue with Buy Now');
      this.router.navigate(['/login']);
    }
  }
}