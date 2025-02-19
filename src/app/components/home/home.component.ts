import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router) {}
  @Output() onClick: EventEmitter<any> = new EventEmitter();


  // Navigate to ProductComponent normally
  products() {
    this.router.navigate(['/product']);
  }

  // Navigate with category query param
  productsformen() {
    this.router.navigate(['/product']);
    this.onClick.emit('formen');
  }
}
