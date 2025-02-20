import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { CurrencyPipe, NgClass, NgFor } from '@angular/common';
import { CartItem, CartService } from '../../service/cart.service';
import { Router } from '@angular/router';
import { HomeComponent } from "../home/home.component";
import { CategoryService } from '../../service/category.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgFor, CurrencyPipe, NgClass, HomeComponent],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'], // Fixed typo from styleUrl to styleUrls
})
export class ProductComponent implements OnInit, OnDestroy {
  private categorySubscription: Subscription | undefined;

  products: any[] = [];
  originalProducts: any[] = []; 
  jwtToken: string | null = null; 
  currentCategory: string | null = null; 
 

  constructor
  (
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data;
        this.originalProducts = [...data]; 
        
        // Subscribe to category changes
        this.categorySubscription = this.categoryService.currentCategory$.subscribe(category => {
          if (category) {
            this.toggleCategory(category);
          } else {
            // Reset to show all products when no category is selected
            this.products = [...this.originalProducts];
            this.currentCategory = null;
          }
        });
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });

    if (typeof window !== 'undefined' && window.localStorage) {
      this.jwtToken = localStorage.getItem('jwtToken');
    }
  }

  ngOnDestroy() {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
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