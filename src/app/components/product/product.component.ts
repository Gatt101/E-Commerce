import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ProductService } from '../../service/product.service';
import { CurrencyPipe, NgClass, NgFor } from '@angular/common';
import { CartItem, CartService } from '../../service/cart.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../service/category.service';
import { Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgFor, CurrencyPipe, NgClass],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  products: any[] = [];
  originalProducts: any[] = [];
  jwtToken: string | null = null;
  currentCategory: string | null = null;
  isBrowser: boolean;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private categoryService: CategoryService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Combine category and search query observables
      const subscription = combineLatest([
        this.categoryService.currentCategory$,
        this.productService.searchQuery$,
        this.productService.getProducts()
      ]).subscribe({
        next: ([category, searchQuery, products]) => {
          this.originalProducts = products;
          
          // Apply filters
          let filteredProducts = [...products];
          
          // Apply search filter
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredProducts = filteredProducts.filter(product =>
              product.title.toLowerCase().includes(query) ||
              product.description.toLowerCase().includes(query) ||
              product.category.toLowerCase().includes(query)
            );
          }
          
          // Apply category filter
          if (category) {
            filteredProducts = filteredProducts.filter(
              product => product.category === category
            );
            this.currentCategory = category;
          } else {
            this.currentCategory = null;
          }
          
          this.products = filteredProducts;
        },
        error: (err) => {
          console.error('Error fetching products:', err);
        }
      });

      this.subscriptions.push(subscription);
      this.jwtToken = this.getToken();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  isCategoryActive(category: string): boolean {
    return this.currentCategory === category;
  }

  toggleCategory(category: string) {
    if (this.currentCategory === category) {
      this.products = [...this.originalProducts];
      this.currentCategory = null;
    } else {
      this.products = this.originalProducts.filter(
        (product) => product.category === category
      );
      this.currentCategory = category;
    }
    console.log(this.products);
  }

  addToCart(item: CartItem): void {
    if (this.isBrowser) {
      this.cartService.addToCart(item);
    } else {
      console.error('Cart operations are not available in SSR mode');
    }
  }

  buyNow(item: CartItem): void {
    if (this.jwtToken !== null) {
      if (this.isBrowser) {
        this.cartService.buyNow(item);
        this.router.navigate(['/checkout']);
      } else {
        console.error('Cart operations are not available in SSR mode');
      }
    } else {
      alert('Please login to continue with Buy Now');
      this.router.navigate(['/login']);
    }
  }

  
  private getToken(): string | null {
    if (!this.isBrowser) {
      return null; 
    }
    return sessionStorage.getItem('jwtToken') || null; 
  }
}
