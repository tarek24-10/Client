import { inject, Injectable } from '@angular/core';
import {loadStripe, Stripe, StripeElements} from '@stripe/stripe-js'
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CartService } from './cart.service';
import { firstValueFrom, map } from 'rxjs';
import { ShoppingCart } from '../../shared/models/shoppingCart';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripePromise?: Promise<Stripe | null>;
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private cartSerive = inject(CartService);
  private elements?: StripeElements;

  constructor(){
    this.stripePromise = loadStripe(environment.stripePublicKey);
  }

  getStripeInstance(){
    return this.stripePromise;
  }

  async initializeElements(){
    if(!this.elements){
      const stripe = await this.getStripeInstance();
      if(stripe){
        const cart = await firstValueFrom(this.createOrUpdatePaymentIntenet());
        this.elements = stripe.elements({clientSecret: cart.clientSecret, appearance:{labels:'floating'}})
      }
      else{
        throw new Error("Stripe has nt been loaded");
      }
    }

    return this.elements;
  }

  createOrUpdatePaymentIntenet(){
    const cart = this.cartSerive.cart();
    if(!cart){
      throw new Error("Problem with cart");
    }

    return this.http.post<ShoppingCart>(this.baseUrl + 'payment/' + cart.id, {}).pipe(
      map(cart => {this.cartSerive.cart.set(cart);
          return cart;})
    )
  }
}
