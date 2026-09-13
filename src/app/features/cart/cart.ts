import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { ShoppingCartItem } from './shopping-cart-item/shopping-cart-item';
import { OrderSummary } from "../../shared/components/order-summary/order-summary";
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [ShoppingCartItem, OrderSummary, EmptyState],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  cartService = inject(CartService);
  private router = inject(Router);

  onAction(){
    this.router.navigateByUrl("/shop");
  }
}
