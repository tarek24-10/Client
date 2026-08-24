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
  brands:string[] = [];
  types:string[] = [];

  getProducts() {
      return this.http.get<Pagination<Product>>(this.baseUrl + "products?pageSize=18");
    };

  getBrands() {
      return this.http.get<string[]>(this.baseUrl + "brands").subscribe({
        next : responce => this.brands = responce,
        error : error => console.log(error)
      });
  }

  getTypes() {
      return this.http.get<string[]>(this.baseUrl + "types").subscribe({
        next : responce => this.types = responce,
        error : error => console.log(error)
      });
  }
}

