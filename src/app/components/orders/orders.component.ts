import { Component, Inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser, CurrencyPipe, NgFor, NgIf, DatePipe } from '@angular/common';
import { OrderService } from '../../service/order.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [NgFor, CurrencyPipe, NgIf, DatePipe],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  orders = signal<any[]>([]);
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

  ngOnInit() {
    // ✅ Ensure API call runs only in the browser
    if (this.isBrowser) {
      setTimeout(() => {
        this.userService.getUser().subscribe(
          (response) => {
            console.log('User Data:', response);
            this.name.set(response?.name || null);
            this.email.set(response?.email || null);
            this.userId.set(response?.id || null);

            if (this.name()) {
              this.loadOrders(); // ✅ Call `loadOrders()` only after `name` is set
            } else {
              console.error('User name is null. Cannot load orders.');
            }
          },
          (error) => {
            console.error('Error fetching user:', error);
          }
        );
      }, 0); // ✅ Delay execution to prevent conflicts in SSR
    }
  }

  loadOrders() {
    if (!this.name()) {
      console.error('User name is not available, skipping order fetch.');
      return;
    }

    this.orderService.getOrders(this.name()!).subscribe({
      next: (data) => {
        this.orders.set(data); // ✅ Using Signal to update UI reactively
        console.log('Orders loaded:', this.orders());
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      }
    });
  }

  // ✅ Computed Signal: Auto-updates when `orders` changes
  orderCount = computed(() => this.orders().length);
}
