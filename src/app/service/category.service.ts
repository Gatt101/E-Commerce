import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private selectedCategory = new BehaviorSubject<string>('');
  currentCategory$ = this.selectedCategory.asObservable();

  setCategory(category: string) {
    this.selectedCategory.next(category);
  }
} 