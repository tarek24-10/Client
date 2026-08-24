import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../../shared/models/product';
import { Pagination } from '../../shared/models/pagination';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ShopService {

  private baseUrl = "https://localhost:5001/api/";
  private http = inject(HttpClient);

  getProducts() {
      return this.http.get<Pagination<Product>>(this.baseUrl + "products");
    };
}

