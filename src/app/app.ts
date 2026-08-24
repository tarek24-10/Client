import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./layout/header/header";
import { HttpClient } from '@angular/common/http';
import { Product } from './shared/models/product';
import { Pagination } from './shared/models/pagination';
import { ShopService } from './core/services/shop.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = 'E-Commerce';
  private shopService = inject(ShopService);

  products = signal<Product[]>([]);

  ngOnInit(): void {
    this.shopService.getProducts().subscribe({
      next: (response) => this.products.set(response.data),
      error: (error) => console.log(error)
    });
  }
}
