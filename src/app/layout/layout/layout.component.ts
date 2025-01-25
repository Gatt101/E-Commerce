import { NgClass, NgIf } from '@angular/common';
import { Component, computed, OnInit, Signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CartItem, CartService } from '../../service/cart.service';
import { CartComponent } from '../../components/cart/cart.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterModule,
    HttpClientModule,NgIf
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  constructor(private cartService:CartService) {}
  cartItems = this.cartService.getCartItems();

  count = computed(() => this.cartItems().length);

}
