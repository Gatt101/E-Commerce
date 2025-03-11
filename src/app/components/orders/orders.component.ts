import { Component, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser, CurrencyPipe, NgFor, NgIf, DatePipe } from '@angular/common';
import { OrderService } from '../../service/order.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [NgFor, CurrencyPipe,NgIf,DatePipe],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'] 
})
export class OrdersComponent {
  orders = signal<any[]>([]); // ✅ Using Signal for Reactivity
  userId = signal<number | null>(null);
  name = signal<string | null>(null);
  email = signal<string | null>(null);

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: object 
  ) {}

  ngOnInit() {
    // ✅ Ensure API call runs only in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.userService.getUser().subscribe(
        (response) => {
          console.log('User Data:', response);
          this.name.set(response?.name || null);
          this.email.set(response?.email || null);
          this.userId.set(response?.id || null);

          if (this.userId()) {
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
  }

  loadOrders() {
    if (!this.userId()) {
      console.error('User ID is not available, skipping order fetch.');
      return;
    }

    this.orderService.getOrders(this.userId()!).subscribe({
      next: (data) => {
        this.orders.set(data); // ✅ Using Signal to update UI reactively
        console.log('Orders loaded:', this.orders());
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      }
    });
  }
}
