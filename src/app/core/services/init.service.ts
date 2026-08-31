import { inject, Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { of } from 'rxjs';
import { ShoppingCart } from '../../shared/models/shoppingCart';

@Injectable({
  providedIn: 'root',
})
export class InitService {

  private cartService = inject(CartService);

  test?:ShoppingCart;

  init(){
    const cartId = localStorage.getItem('cart_id');
    const cart$ = cartId ? this.cartService.getCart(cartId) : of(null);

    return cart$;
  }
  
}
