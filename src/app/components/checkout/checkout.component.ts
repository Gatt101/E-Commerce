import { Component, OnInit } from '@angular/core';
import { CartItem, CartService } from '../../service/cart.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../service/order.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems = this.cartService.getCartItems();
  buyNowItem = this.cartService.getBuyNowItem();
  userId: number | null = null; // Store user ID

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private router: Router
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
    this.userService.getUser().subscribe(
      (response) => {
        console.log('User Data:', response);
        this.userId = response?.id || null; // Ensure userId exists
      },
      (error) => {
        console.error('Error fetching user ID:', error);
      }
    );
  }
  

  getTotal(): number {
    const buyNowItem = this.buyNowItem();
    if (buyNowItem) {
      return buyNowItem.price * buyNowItem.quantity;
    }
    return this.cartService.getTotal();
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      if (!this.userId) {
        alert('User ID not found. Please log in again.');
        return;
      }

      const buyNowItem = this.buyNowItem();
      if (buyNowItem) {
        const orderData = {
          
            user_id: this.userId, // Now correctly assigned
            product_id: buyNowItem.id,
            product_name: buyNowItem.title,
            price: buyNowItem.price,
            quantity: buyNowItem.quantity,
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
        this.cartService.clearCart();
        this.router.navigate(['/home']);
        alert('Order placed successfully!');
      }
    }
  }
}

