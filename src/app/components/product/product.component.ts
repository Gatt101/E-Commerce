import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ProductService } from '../../service/product.service';
import { CurrencyPipe, NgClass, NgFor } from '@angular/common';
import { CartItem, CartService } from '../../service/cart.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../service/category.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgFor, CurrencyPipe, NgClass],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, OnDestroy {
  private categorySubscription: Subscription | undefined;
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
    @Inject(PLATFORM_ID) private platformId: object // Inject platform ID for SSR check
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.productService.getProducts().subscribe({
        next: (data: any) => {
          this.products = data;
          this.originalProducts = [...data];

          // Subscribe to category changes
          this.categorySubscription = this.categoryService.currentCategory$.subscribe(category => {
            if (category) {
              this.toggleCategory(category);
            } else {
              this.products = [...this.originalProducts];
              this.currentCategory = null;
            }
          });
        },
        error: (err) => {
          console.error('Error fetching products:', err);
        }
      });

      this.jwtToken = this.getToken(); // ✅ Safe JWT token retrieval
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

  /**
   * ✅ Safe method to retrieve JWT token (Prevents SSR issues)
   */
  private getToken(): string | null {
    if (!this.isBrowser) {
      return null; 
    }
    return sessionStorage.getItem('jwtToken') || null; 
  }
}
