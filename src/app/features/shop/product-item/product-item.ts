import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Product } from '../../../shared/models/product';
import { CurrencyPipe } from '@angular/common';
import { MatAnchor } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-product-item',
  imports: [MatCardModule, CurrencyPipe, MatAnchor, MatIconModule],
  templateUrl: './product-item.html',
  styleUrl: './product-item.css',
})
export class ProductItem {
  @Input() product?:Product;
}
