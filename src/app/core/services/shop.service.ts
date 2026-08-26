import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../../shared/models/product';
import { Pagination } from '../../shared/models/pagination';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ShopService {

  private baseUrl = "https://localhost:5001/api/";
  private http = inject(HttpClient);
  brands:string[] = [];
  types:string[] = [];

  getProducts(brands?:string[], types?:string[], sort?:string) {

      let params = new HttpParams();

      if(brands && brands.length > 0)
      {
        params = params.append("brands", brands.join(","));
      }

      if(types && types.length > 0)
      {
        params = params.append("types", types.join(","));
      }

      if(sort){
        params = params.append("sort", sort);
      }

      params = params.append("pagesize",20);

      return this.http.get<Pagination<Product>>(this.baseUrl + "products", {params});
    };

  getBrands() {
      return this.http.get<string[]>(this.baseUrl + "products/brands").subscribe({
        next : responce => this.brands = responce,
        error : error => console.log(error)
      });
  }

  getTypes() {
      return this.http.get<string[]>(this.baseUrl + "products/types").subscribe({
        next : responce => this.types = responce,
        error : error => console.log(error)
      });
  }
}

