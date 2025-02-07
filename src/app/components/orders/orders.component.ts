import { Component } from '@angular/core';
import { CurrencyPipe, NgFor } from '@angular/common';
import { OrderService } from '../../service/order.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [NgFor, CurrencyPipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  orders: any[] = [];  // Initialize an empty array
  userId!: number;
  name!: string;
  email!: string;
  constructor(private orderService: OrderService, private userService: UserService) {}

  ngOnInit() {
    // Fetch user first
    this.userService.getUser().subscribe(
      (response) => {
        console.log('User Data:', response);
        this.name = response?.name; // ✅ Ensure name is assigned before calling API
        this.email = response?.email;
        this.userId = response?.id; // ✅ Ensure userId is assigned before calling API
        
        if (this.userId) {
          this.loadOrders(); // ✅ Now we call `loadOrders()` only after `userId` is set
        } else {
          console.error('User ID is null. Cannot load orders.');
        }
      },
      (error) => {
        console.error('Error fetching user ID:', error);
      }
    );
  }

  loadOrders() {
    if (!this.userId) {
      console.error('User ID is not available, skipping order fetch.');
      return;
    }

    this.orderService.getOrders(this.userId).subscribe({
      next: (data) => {
        this.orders = data;
        console.log('Orders loaded:', this.orders);
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      }
    });
  }
}
