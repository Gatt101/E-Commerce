import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgFor, CurrencyPipe,NgIf],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((response: any) => {
      this.products = response.products; // DummyJSON returns data in { products: [...] } format
    });
  }
}
