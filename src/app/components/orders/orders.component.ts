import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { OrderService } from '../../service/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  orders: any[] = [];  // Initialize an empty array

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        console.log('Orders loaded:', this.orders);
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      }
    });
  }

  printOrder() {
    console.log('Printing orders:');
    this.orders.forEach(order => {
      console.log(order);
    });
  }
}
