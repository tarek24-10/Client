import { Component, input } from '@angular/core';
import { CartItem } from '../../../shared/models/cartItem';
import { RouterLink } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-shopping-cart-item',
  imports: [RouterLink, MatButton, MatIcon, MatIconButton, CurrencyPipe, MatIconButton],
  templateUrl: './shopping-cart-item.html',
  styleUrl: './shopping-cart-item.css',
})
export class ShoppingCartItem {
  
  item = input.required<CartItem>();

}
