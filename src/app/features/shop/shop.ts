import { Component, inject, signal } from '@angular/core';
import { Product } from '../../shared/models/product';
import { ShopService } from '../../core/services/shop.service';
import { MatCardModule } from '@angular/material/card';
import { ProductItem } from "./product-item/product-item";
import { MatAnchor } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDialog } from '@angular/material/dialog';
import { FilterDialog } from './filter-dialog/filter-dialog';

@Component({
  selector: 'app-shop',
  imports: [MatCardModule, ProductItem, MatAnchor, MatIconModule],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {
protected readonly title = 'E-Commerce';
  private shopService = inject(ShopService);
  private dialogService = inject(MatDialog);
  selectedBrands:string[] = [];
  selectedTypes:string[] = [];

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

    openFilterDialog(){
      const dialogRef = this.dialogService.open(FilterDialog, {
        minWidth: "500px",
        data:{
                selectedBrands: this.selectedBrands,
                selectedTypes: this.selectedTypes
        }
      });
      dialogRef.afterClosed().subscribe({
        next: result => {
        if (result) {
          this.selectedBrands = result.selectedBrands;
          this.selectedTypes = result.selectedTypes;
          this.shopService.getProducts(this.selectedBrands,this.selectedTypes).subscribe({
            next : responce => this.products.set(responce.data),
          })
        }},
      })
    }
}
