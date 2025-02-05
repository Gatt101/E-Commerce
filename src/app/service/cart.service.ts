import { Injectable, Signal, signal } from '@angular/core';

export interface CartItem {
  id: number;
  image: any;
  title: string;
  description: string;
  price: number;
  quantity: number;
}
@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>(this.loadCart());
  private buyNowItem = signal<CartItem | null>(null);

  private loadCart(): CartItem[] {
    if (typeof localStorage !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  }

  private saveCart(items: CartItem[]): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }

  getCartItems(): Signal<CartItem[]> {
    return this.cartItems;
  }

  getBuyNowItem(): Signal<CartItem | null> {
    return this.buyNowItem;
  }

  buyNow(item: CartItem): void {
    this.buyNowItem.set({ ...item, quantity: 1 });
  }

  addToCart(item: CartItem): void {
    this.cartItems.update((items) => {
      const existingItem = items.find(i => i.id === item.id);
      if (existingItem) {
        return items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      const newItem = { ...item, quantity: 1 };
      const updatedItems = [...items, newItem];
      this.saveCart(updatedItems);
      return updatedItems;
    });
  }

  removeFromCart(item: CartItem): void {
    this.cartItems.update((items) => {
      const updatedItems = items.filter((i) => i.id !== item.id);
      this.saveCart(updatedItems);
      return updatedItems;
    });
  }

  clearCart(): void {
    this.cartItems.set([]);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('cart');
    }
  }

  clearBuyNowItem(): void {
    this.buyNowItem.set(null); // Clear the Buy Now item
  }

  getTotal(): number {
    return this.cartItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}