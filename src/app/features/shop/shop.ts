import { Component, inject, signal } from '@angular/core';
import { Product } from '../../shared/models/product';
import { ShopService } from '../../core/services/shop.service';
import { MatCardModule } from '@angular/material/card';
import { ProductItem } from "./product-item/product-item";
import { MatAnchor, MatIconButton } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDialog } from '@angular/material/dialog';
import { FilterDialog } from './filter-dialog/filter-dialog';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { ShopParams } from '../../shared/models/shopParams';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../shared/models/pagination';
import { FormsModule } from '@angular/forms';
import { EmptyState } from '../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-shop',
  imports: [MatCardModule, ProductItem, MatAnchor, MatIconModule, MatMenu, MatSelectionList, MatListOption, MatMenuTrigger,
    MatPaginatorModule, FormsModule, MatIconButton, EmptyState],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {
protected readonly title = 'E-Commerce';
  private shopService = inject(ShopService);
  private dialogService = inject(MatDialog);

  sortOptions = [
    {name:"Alphabetical", value:"name"},
    {name:"Price: Low-High", value:"priceAsc"},
    {name:"price: High-Low", value:"priceDesc"}
  ];

  shopParams = new ShopParams();

  pageSizeOptions = [5,10,15,20];

  products = signal<Pagination<Product> | null>(null);

  ngOnInit(): void {
    this.initializeShop();
  }

    initializeShop(){
      this.shopService.getBrands();
      this.shopService.getTypes();

      this.getProducts();
      };

    resetFilters(){
      this.shopParams =  new ShopParams();
      this.getProducts();
    }

    getProducts(){
      this.shopService.getProducts(this.shopParams).subscribe({
      next: (response) => this.products.set(response),
      error: (error) => console.log(error)
    });
    };

    openFilterDialog(){
      const dialogRef = this.dialogService.open(FilterDialog, {
        minWidth: "500px",
        data:{
                selectedBrands: this.shopParams.brands,
                selectedTypes: this.shopParams.types
        }
      });

      dialogRef.afterClosed().subscribe({
        next: result => {
        if (result) {
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;
          this.shopParams.pageNumber = 1;
          this.getProducts();
        }},
      });
    }

    onSortChange(event:MatSelectionListChange){
      const selectedOption = event.options[0];
      if(selectedOption){
        this.shopParams.sort = selectedOption.value;
      }
      this.shopParams.pageNumber = 1;
      this.getProducts();
    }

    handlePageEvent(event:PageEvent){
      this.shopParams.pageNumber = event.pageIndex + 1;
      this.shopParams.pageSize = event.pageSize;
      console.log(this.shopParams.pageNumber);
      console.log(this.shopParams.pageSize);
      this.getProducts();
    }

    onSearchChange(){
      this.shopParams.pageNumber = 1;
      this.getProducts();
    }
}
