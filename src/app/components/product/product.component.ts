import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { CurrencyPipe, NgClass, NgFor } from '@angular/common';
import { CartItem, CartService } from '../../service/cart.service';
import { Router } from '@angular/router';
import { HomeComponent } from "../home/home.component";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgFor, CurrencyPipe, NgClass, HomeComponent],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'], // Fixed typo from styleUrl to styleUrls
})
export class ProductComponent implements OnInit {
handleChildData($event: Event) {
 console.log($event);
}

  products: any[] = [];
  originalProducts: any[] = []; 
  jwtToken: string | null = null; 
  currentCategory: string | null = null; 
 

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
        this.originalProducts = [...data]; 
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });

    if (typeof window !== 'undefined' && window.localStorage) {
      this.jwtToken = localStorage.getItem('jwtToken');
    }
    
  }

  

  isCategoryActive(category: string): boolean {
    return this.currentCategory === category;
  }
  // Toggle between categories
  toggleCategory(category: string) {
    if (this.currentCategory === category) {
      // If the current category is already selected, reset to original products
     
      this.products = [...this.originalProducts];
      this.currentCategory = null; // Reset category
    } else {
      // Filter products based on the selected category
     
      this.products = this.originalProducts.filter(
        (product) => product.category === category
      );
      this.currentCategory = category; // Set the current category
    }
    console.log(this.products);
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