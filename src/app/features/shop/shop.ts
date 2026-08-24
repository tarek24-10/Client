import { Component, inject, signal } from '@angular/core';
import { Product } from '../../shared/models/product';
import { ShopService } from '../../core/services/shop.service';
import { MatCardModule } from '@angular/material/card';
import { ProductItem } from "./product-item/product-item";

@Component({
  selector: 'app-shop',
  imports: [MatCardModule, ProductItem],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {
protected readonly title = 'E-Commerce';
  private shopService = inject(ShopService);

  products = signal<Product[]>([]);

  ngOnInit(): void {
    this.initializeShop();
  }

    initializeShop(){
      this.shopService.getBrands();
      this.shopService.getTypes();

      this.shopService.getProducts().subscribe({
      next: (response) => this.products.set(response.data),
      error: (error) => console.log(error)
    });};
}
