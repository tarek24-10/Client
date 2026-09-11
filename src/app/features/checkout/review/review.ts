import { Component, inject, Input, input } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { ConfirmationToken } from '@stripe/stripe-js';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { CardPipe } from '../../../shared/pipes/card-pipe';

@Component({
  selector: 'app-review',
  imports: [CurrencyPipe, AddressPipe, CardPipe],
  templateUrl: './review.html',
  styleUrl: './review.css',
})
export class Review {
  cartService = inject(CartService);

  @Input() confirmationToken?:ConfirmationToken;
}
