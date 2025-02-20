import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../service/category.service';
import { NewsletterService } from '../../service/newsletter.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  email: string = '';
  isSubscribing: boolean = false;

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private newsletterService: NewsletterService
  ) {}

  products() {
    this.categoryService.setCategory('');
    this.router.navigate(['/product']);
  }

  productsformen() {
    this.categoryService.setCategory('men\'s clothing');
    this.router.navigate(['/product']);
  }

  productsforwomen() {
    this.categoryService.setCategory('women\'s clothing');
    this.router.navigate(['/product']);
  }

  subscribeNewsletter(event: Event) {
    event.preventDefault();
    if (!this.email) {
      alert('Please enter an email address');
      return;
    }
    
    this.isSubscribing = true;
    this.newsletterService.subscribe(this.email).subscribe({
      next: () => {
        alert('Thank you for subscribing to our newsletter!');
        this.email = '';
      },
      error: (error) => {
        console.error('Newsletter subscription failed:', error);
        alert('Failed to subscribe. Please try again later.');
      },
      complete: () => {
        this.isSubscribing = false;
      }
    });
  }
}