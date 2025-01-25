import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { CartItem, CartService } from '../../service/cart.service';
import { CheckoutComponent } from '../checkout/checkout.component';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgFor, CurrencyPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  products: any[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((data: any) => {
      this.products = data; 
    });
  }
  addToCart(item:CartItem):void {
    this.cartService.addToCart(item);
  }

  
}
