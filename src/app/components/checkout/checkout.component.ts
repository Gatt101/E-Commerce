import { Component } from '@angular/core';
import { CartService } from '../../service/cart.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  checkoutForm: FormGroup;
  cartItems = this.cartService.getCartItems();

  constructor(
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

  getTotal(): number {
    return this.cartService.getTotal();
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      // Here you would typically process the payment and order
      this.cartService.clearCart();
      this.router.navigate(['/home']);
      alert('Order placed successfully!');
    }
  }
}
