import { Component, OnInit, Inject, PLATFORM_ID, computed, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem, CartService } from '../../service/cart.service';
import { OrderService } from '../../service/order.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  isBrowser: boolean;

  cartItems = this.cartService.getCartItems();
  buyNowItem = this.cartService.getBuyNowItem();

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.checkoutForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]]
    });
  }

  ngOnInit() {}

  getTotal = computed(() => {
    const buyNow = this.buyNowItem();
    if (buyNow) {
      return buyNow.price * buyNow.quantity;
    }
    return this.cartItems().reduce((total, item) => total + item.price * item.quantity, 0);
  });

  onSubmit() {
    if (this.checkoutForm.valid) {
      if (this.buyNowItem()) {
        const buyNow = this.buyNowItem();
        if (!buyNow) return;

        const orderData = {
          productId: String(buyNow.id),
          productName: buyNow.title,
          price: buyNow.price,
          quantity: buyNow.quantity,
          viewedAt: new Date().toISOString(),
          image: buyNow.image
        };

        this.orderService.addOrder(orderData).subscribe(
          (response) => {
            console.log('Order placed:', response);
            this.cartService.clearBuyNowItem();
            this.router.navigate(['/home']);
            alert('Order placed successfully!');
          },
          (error) => {
            console.error('Order placement failed:', error);
            alert('Failed to place order. Please try again.');
          }
        );
      } else {
        const orderData = this.cartItems().map((item) => ({
          productId: String(item.id),
          productName: item.title,
          price: item.price,
          quantity: item.quantity,
          viewedAt: new Date().toISOString(),
          image: item.image
        }));

        this.orderService.addMultipleOrders(orderData).subscribe(
          (response) => {
            console.log('Order placed:', response);
            this.cartService.clearCart();
            this.router.navigate(['/home']);
            alert('Order placed successfully!');
          },
          (error) => {
            console.error('Order placement failed:', error);
            alert('Failed to place order. Please try again.');
          }
        );
      }
    }
  }
}
