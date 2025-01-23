import { Component } from '@angular/core';
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
export class ProductComponent {
  products:any[]=[];
  constructor(private productService:ProductService){
    this.productService.getProducts().subscribe((data)=>{
      this.products=data;
    });
  }
}
