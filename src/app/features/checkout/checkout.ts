import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { OrderSummary } from "../../shared/components/order-summary/order-summary";
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import { Router, RouterLink } from "@angular/router";
import { MatAnchor, MatButton } from "@angular/material/button";
import { StripeService } from '../../core/services/stripe.service';
import { ConfirmationToken, StripeAddressElement, StripeAddressElementChangeEvent, StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import { SnackbarService } from '../../core/services/snackbar.service';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Address } from '../../shared/models/user';
import { firstValueFrom } from 'rxjs';
import { AccountService } from '../../core/services/account.service';
import { Delivery } from "./delivery/delivery";
import { Review } from './review/review';
import { CartService } from '../../core/services/cart.service';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { OrderToCreate, ShippingAddress } from '../../shared/models/order';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-checkout',
  imports: [OrderSummary, MatStepperModule, RouterLink, MatAnchor, MatButton, MatCheckboxModule, Delivery, Review, CurrencyPipe
    , JsonPipe, MatProgressSpinnerModule
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit, OnDestroy {
  private stripeSevice = inject(StripeService);
  private addressElement?: StripeAddressElement;

  private snackbar = inject(SnackbarService);
  saveAddress = false;

  private accountService = inject(AccountService);
  cartService = inject(CartService);

  private paymentElement?: StripePaymentElement;

  completionStatus = signal<{address:boolean, card:boolean, delivery:boolean}>({address:false, card:false, delivery:false})

  confirmationToken?:ConfirmationToken;

  private router = inject(Router);

  loading = false;

  private orderService = inject(OrderService);

  async ngOnInit(){
    try{
        this.addressElement = await this.stripeSevice.createAddressElement();
        this.addressElement.mount('#address-element');

        this.addressElement.on('change', this.handleAddressChange);

        this.paymentElement = await this.stripeSevice.createPaymentElement();
        this.paymentElement.mount('#payment-element');

        this.paymentElement.on('change', this.handlePaymentChange);

    }
    catch(error : any){
      this.snackbar.error(error.message)
    }
  }

  handleAddressChange = (event:StripeAddressElementChangeEvent) => {
    this.completionStatus.update(state =>{ state.address = event.complete;
      return state
    })
  }

  handlePaymentChange = (event:StripePaymentElementChangeEvent) => {
    this.completionStatus.update(state =>{ state.card = event.complete;
      return state
    })
  }

  handleDeliveryChange = (event:boolean) => {
    this.completionStatus.update(state =>{ state.delivery = event;
      return state
    })
  }

  onSaveAddressCheckboxChange(event:MatCheckboxChange){
    this.saveAddress = event.checked;
  }

  async getConfirmationToken(){
    try{
    if(Object.values(this.completionStatus()).every(status => status == true)){
        const result = await this.stripeSevice.createConfirmationToken();
        if(result.error) throw new Error(result.error.message);

        this.confirmationToken = result.confirmationToken;
      }
    }
    catch(error:any){
      this.snackbar.error(error.message);
    }
  }

  async onStepChange(event:StepperSelectionEvent){
    if(event.selectedIndex === 1){
      if(this.saveAddress){
        const address = await this.getAddressFromStripeAddress() as Address;
        console.log(address);
        if(address) await firstValueFrom(this.accountService.updateAddress(address));
      }
    }

    if(event.selectedIndex === 2){
      await firstValueFrom(this.stripeSevice.createOrUpdatePaymentIntenet());
    }

    if(event.selectedIndex === 3){
      await this.getConfirmationToken();
    }
  }

  
    async confirmPayment(stepper:MatStepper){
      this.loading = true;
      try {
        if(this.confirmationToken){
          const result = await this.stripeSevice.confirmPayment(this.confirmationToken);

          if(result.paymentIntent?.status == 'succeeded'){
            const order = await this.createOrderModel();
            const orderResult = await firstValueFrom(this.orderService.createOrder(order));
            if(orderResult){
              this.orderService.orderComplete = true;
              this.cartService.deleteCart();
              this.cartService.selectedDelivery.set(null);
              this.router.navigateByUrl('/checkout/success')
            }
            else{
              throw new Error('Order creation failed');
            }
          }
          else if(result.error){
            throw new Error(result.error.message)
          }
         else{
             throw new Error('Something wnt wrong')
          }
        }
      } catch (error:any) {
        this.snackbar.error(error.message || 'Something went wrong');
        stepper.previous(); 
      }finally{
        this.loading = false;
      }
    }

  private async createOrderModel():Promise<OrderToCreate>{
    const cart = this.cartService.cart();
    const shippingAddress = await this.getAddressFromStripeAddress() as ShippingAddress;
    const card = this.confirmationToken?.payment_method_preview.card;
    if(!cart?.id || !cart.deliveryMethodId || !card || !shippingAddress){
      throw new Error('Problem creating order')
    }
    return {
      cartId : cart.id,
      paymentSummary:{
        last4: +card.last4,
        brand: card.brand,
        expMonth: card.exp_month,
        expYear: card.exp_year
      },
      deliveryMethodId: cart.deliveryMethodId,
      shippingAddress: shippingAddress
    }
  }

  private async getAddressFromStripeAddress() : Promise<Address | ShippingAddress | null> {
    const result = await this.addressElement?.getValue();
    const address = result?.value.address;

    if(address){
      return {
            name: result.value.name,
            line1: address.line1,
            line2: address.line2 || undefined,
            country: address.country,
            state: address.state,
            city: address.city,
            postalCode: address.postal_code
      }
    }else{
      return null;
    }
  }

  ngOnDestroy(): void {
    this.stripeSevice.disposeElements();
  }
}
