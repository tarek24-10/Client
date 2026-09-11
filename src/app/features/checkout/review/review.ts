import { Component, inject } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-review',
  imports: [CurrencyPipe],
  templateUrl: './review.html',
  styleUrl: './review.css',
})
export class Review {
  cartService = inject(CartService);
}
