import { Component, Inject, PLATFORM_ID, computed, signal, OnInit } from '@angular/core';
import { isPlatformBrowser, CurrencyPipe, NgFor, NgIf, DatePipe } from '@angular/common';
import { OrderService, Order } from '../../service/order.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [NgFor, CurrencyPipe, NgIf, DatePipe],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders = signal<Order[]>([]);
  userId = signal<number | null>(null);
  name = signal<string | null>(null);
  email = signal<string | null>(null);
  isBrowser: boolean;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    setTimeout(() => {
      this.userService.getUser().subscribe({
        next: (response: { id: number; name: string; email: string }) => {
          this.name.set(response.name || null);
          this.email.set(response.email || null);
          this.userId.set(response.id || null);

          if (this.name()) {
            this.loadOrders();
          } else {
            console.error('User name is null. Cannot load orders.');
          }
        },
        error: (err) => {
          console.error('Error fetching user:', err);
        }
      });
    }, 0);
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data: Order[]) => {
        this.orders.set(data);
        console.log('Orders loaded:', this.orders());
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      }
    });
  }

  orderCount = computed(() => this.orders().length);
}
