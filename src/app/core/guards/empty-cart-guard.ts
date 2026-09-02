import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CartService } from '../services/cart.service';
import { SnackbarService } from '../services/snackbar.service';

export const emptyCartGuard: CanActivateFn = (route, state) => {

  const cartService = inject(CartService);
  const snack = inject(SnackbarService);

  if(!cartService.cart() || cartService.cart()?.items.length === 0){
    snack.error("your cart is empty");
    return false;
  }

  return true;
};
