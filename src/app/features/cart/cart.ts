import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { ShoppingCartItem } from './shopping-cart-item/shopping-cart-item';

@Component({
  selector: 'app-cart',
  imports: [ShoppingCartItem],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  cartService = inject(CartService);
}
