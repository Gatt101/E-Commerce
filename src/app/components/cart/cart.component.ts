import { Component, OnInit, Signal } from '@angular/core';
import { CartItem, CartService } from '../../service/cart.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgFor, CurrencyPipe, NgIf],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})  // Added the providers array to inject the CartService into the component.  This is necessary to ensure the CartService is initialized before using it in the component.  Without it, the CartService will not be available in the constructor.  This can lead to runtime errors or unexpected behavior.  The providers array is used to create an instance of the service when the component is created.  In this case, the CartService is created and injected into the component.  This allows
 
export class CartComponent {
  constructor(private cartService:CartService) {}

  cartItems = this.cartService.getCartItems();

  getcartItems():Signal<CartItem[]> {
    return this.cartItems;
  }
  addToCart(item:CartItem):void {
    this.cartService.addToCart(item);
  }
  removeFromCart(item:CartItem):void {
    this.cartService.removeFromCart(item);
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }
}
