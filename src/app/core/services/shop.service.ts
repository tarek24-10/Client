import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../../shared/models/product';
import { Pagination } from '../../shared/models/pagination';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ShopParams } from '../../shared/models/shopParams';

@Injectable({
  providedIn: 'root',
})
export class ShopService {

  private baseUrl = "https://localhost:5001/api/";
  private http = inject(HttpClient);
  brands:string[] = [];
  types:string[] = [];

  getProducts(shopParams:ShopParams) {

      let params = new HttpParams();

      if(shopParams.brands.length > 0)
      {
        params = params.append("brands", shopParams.brands.join(","));
      }

      if(shopParams.types.length > 0)
      {
        params = params.append("types", shopParams.types.join(","));
      }

      if(shopParams.sort){
        params = params.append("sort", shopParams.sort);
      }

      params = params.append("pagesize", shopParams.pageSize);

      params = params.append("pageNumber", shopParams.pageNumber);


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

