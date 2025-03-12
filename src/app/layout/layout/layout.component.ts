import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, computed, NgModule, OnInit, Signal, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CartItem, CartService } from '../../service/cart.service';
import { ProductService } from '../../service/product.service';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../service/category.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterModule,
    HttpClientModule,
    NgIf,
    FormsModule,
    NgFor
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  cartItems = this.cartService.getCartItems();
  count = computed(() => this.cartItems().length);
  
  searchText = signal<string>('');
  searchInputValue = '';
  products = signal<any[]>([]);
  showSearchResults = signal<boolean>(false);
  
  searchResults = computed(() => {
    const query = this.searchText().toLowerCase().trim();
    if (!query) return [];
    return this.products().filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    ).slice(0, 5); // Limit to 5 results
  });

  constructor(
    private cartService: CartService, 
    private productService: ProductService,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products.set(data);
    });
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchText.set(target.value);
    this.searchInputValue = target.value;
    this.showSearchResults.set(true);
  }

  onSearchSubmit(event: Event) {
    event.preventDefault();
    if (this.searchText()) {
      this.productService.setSearchQuery(this.searchText());
      this.router.navigate(['/product']);
      this.categoryService.setCategory('');
      this.showSearchResults.set(false);
    }
  }

  selectProduct(product: any) {
    this.searchText.set(product.title);
    this.searchInputValue = product.title;
    this.productService.setSearchQuery(product.title);
    this.showSearchResults.set(false);
    this.router.navigate(['/product']);
    if (product.category) {
      this.categoryService.setCategory(product.category);
    }
  }

  hideSearchResults() {
    setTimeout(() => {
      this.showSearchResults.set(false);
    }, 200);
  }
}
