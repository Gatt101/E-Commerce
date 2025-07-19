import { Injectable, Inject, PLATFORM_ID, Signal, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface CartItem {
  id: number;
  title: string;
  image : string;
  description: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private isBrowser: boolean;
  cartItems = signal<CartItem[]>([]);
  private buyNowItem = signal<CartItem | null>(null);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.cartItems.set(this.loadCart());
    }
  }

  
  private loadCart(): CartItem[] {
    if (!this.isBrowser) return [];

    try {
      const savedCart = sessionStorage.getItem('cart'); // ✅ Uses sessionStorage
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      // console.error('Error loading cart from sessionStorage:', error);
      return [];
    }
  }

  /**
   * ✅ Save cart to `sessionStorage` safely (Only in browser)
   */
  private saveCart(items: CartItem[]): void {
    if (!this.isBrowser) return;

    try {
      sessionStorage.setItem('cart', JSON.stringify(items)); // ✅ Uses sessionStorage
    } catch (error) {
      // console.error('Error saving cart to sessionStorage:', error);
    }
  }

  getCartItems(): Signal<CartItem[]> {
    return this.cartItems;
  }

  getBuyNowItem(): Signal<CartItem | null> {
    return this.buyNowItem;
  }

  /**
   * ✅ Buy Now Function (Does not affect cart)
   */
  buyNow(item: CartItem): void {
    this.buyNowItem.set({ ...item, quantity: 1 });
  }

  /**
   * ✅ Add Item to Cart (Handles duplicates)
   */
  addToCart(item: CartItem): void {
    this.cartItems.update((items) => {
      const existingItem = items.find(i => i.id === item.id);
      let updatedItems;
      
      if (existingItem) {
        updatedItems = items.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        const newItem = { ...item, quantity: 1 };
        updatedItems = [...items, newItem];
      }

      this.saveCart(updatedItems);
      return updatedItems;
    });
  }

  /**
   * ✅ Remove Item from Cart
   */
  removeFromCart(item: CartItem): void {
    this.cartItems.update((items) => {
      const updatedItems = items.filter(i => i.id !== item.id);
      this.saveCart(updatedItems);
      return updatedItems;
    });
  }

  /**
   * ✅ Clear Entire Cart
   */
  clearCart(): void {
    this.cartItems.set([]);
    if (this.isBrowser) {
      sessionStorage.removeItem('cart'); // ✅ Uses sessionStorage
    }
  }

  /**
   * ✅ Clear Buy Now Item (For Immediate Purchase)
   */
  clearBuyNowItem(): void {
    this.buyNowItem.set(null);
  }

  /**
   * ✅ Calculate Total Cart Price
   */
  getTotal(): number {
    return this.cartItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}
