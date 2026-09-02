import { inject, Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { forkJoin, of } from 'rxjs';
import { ShoppingCart } from '../../shared/models/shoppingCart';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {

  private cartService = inject(CartService);
  private accountService = inject(AccountService);

  test?:ShoppingCart;

  init(){
    const cartId = localStorage.getItem('cart_id');
    const cart$ = cartId ? this.cartService.getCart(cartId) : of(null);

    return forkJoin({
      cart: cart$,
      user: this.accountService.getUserInfo()
    })
  }
  
}
