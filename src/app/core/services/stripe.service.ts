import { inject, Injectable } from '@angular/core';
import {loadStripe, Stripe, StripeAddressElement, StripeAddressElementOptions, StripeElements} from '@stripe/stripe-js'
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CartService } from './cart.service';
import { firstValueFrom, map } from 'rxjs';
import { ShoppingCart } from '../../shared/models/shoppingCart';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripePromise?: Promise<Stripe | null>;
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private cartSerive = inject(CartService);
  private elements?: StripeElements;
  private addressElement?: StripeAddressElement;
  private accountService = inject(AccountService);

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
        throw new Error("Stripe has not been loaded");
      }
    }

    return this.elements;
  }

  async createAddressElement(){
    if(!this.addressElement){
      const elements = await this.initializeElements();
      if(elements){
        const options: StripeAddressElementOptions = {
          mode:'shipping'
        };
        this.addressElement = elements.create('address', options);
      } else{
        throw new Error('Elements instance has not been loaded');
      }
    }
    return this.addressElement;
  }

  createOrUpdatePaymentIntenet(){
    const cart = this.cartSerive.cart();
    console.log(cart);
    if(!cart){
      throw new Error("Problem with cart");
    }

    return this.http.post<ShoppingCart>(this.baseUrl + 'payment/' + cart.id, {}).pipe(
      map(cart => {this.cartSerive.cart.set(cart);
          return cart;})
    )
  }
}
