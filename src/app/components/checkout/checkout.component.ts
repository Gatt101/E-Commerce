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

  // ✅ Using Signals from `CartService`
  cartItems = this.cartService.getCartItems(); // Directly get the signal
  buyNowItem = this.cartService.getBuyNowItem(); // Signal-based buy now item
  userId = signal<number | null>(null); // ✅ Reactive user ID

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
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

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.userService.getUser().subscribe(
        (response) => {
          console.log('User Data:', response);
          this.userId.set(response?.id || null);
        },
        (error) => {
          console.error('Error fetching user ID:', error);
        }
      );
    }
  }

  // ✅ Use computed signal for total price
  getTotal = computed(() => {
    const buyNow = this.buyNowItem();
    if (buyNow) {
      return buyNow.price * buyNow.quantity;
    }
    return this.cartItems().reduce((total, item) => total + item.price * item.quantity, 0);
  });

  onSubmit() {
    if (this.checkoutForm.valid) {
      if (!this.userId()) {
        alert('User ID not found. Please log in again.');
        return;
      }

      if (this.buyNowItem()) {
        const buyNow = this.buyNowItem();
        if (!buyNow) return;

        const orderData = {
          user_id: this.userId(),
          product_id: buyNow.id,
          product_name: buyNow.title,
          price: buyNow.price,
          quantity: buyNow.quantity,
          viewed_at: new Date().toISOString()
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
          user_id: this.userId(),
          product_id: item.id,
          product_name: item.title,
          price: item.price,
          quantity: item.quantity,
          viewed_at: new Date().toISOString()
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
