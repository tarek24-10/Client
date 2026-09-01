import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { ShoppingCartItem } from './shopping-cart-item/shopping-cart-item';
import { OrderSummary } from "../../shared/components/order-summary/order-summary";

@Component({
  selector: 'app-cart',
  imports: [ShoppingCartItem, OrderSummary],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  cartService = inject(CartService);
}
