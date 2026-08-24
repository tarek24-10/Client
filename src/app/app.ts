import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./layout/header/header";
import { HttpClient } from '@angular/common/http';
import { Product } from './shared/models/product';
import { Pagination } from './shared/models/pagination';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = 'E-Commerce';

  private baseUrl = "https://localhost:5001/api/";
  private http = inject(HttpClient);
  products = signal<Product[]>([]);

  ngOnInit(): void {
    this.http.get<Pagination<Product>>(this.baseUrl + "products").subscribe({
      next: responce => this.products.set(responce.data),
      error: error => console.log(error),
      complete: () => console.log("Complete") 
    });
  }
}
