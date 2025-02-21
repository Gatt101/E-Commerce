import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../service/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(
    private router: Router,
    private categoryService: CategoryService
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
}