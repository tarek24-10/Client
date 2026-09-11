import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { OrderSummary } from "../../shared/components/order-summary/order-summary";
import {MatStepperModule} from '@angular/material/stepper';
import { RouterLink } from "@angular/router";
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

@Component({
  selector: 'app-checkout',
  imports: [OrderSummary, MatStepperModule, RouterLink, MatAnchor, MatButton, MatCheckboxModule, Delivery, Review, CurrencyPipe
    , JsonPipe
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
        console.log(this.confirmationToken);
      }
    }
    catch(error:any){
      this.snackbar.error(error.message);
    }
  }

  async onStepChange(event:StepperSelectionEvent){
    if(event.selectedIndex === 1){
      if(this.saveAddress){
        const address = await this.getAddressFromStripeAddress();
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

  private async getAddressFromStripeAddress() : Promise<Address | null> {
    const result = await this.addressElement?.getValue();
    const address = result?.value.address;

    if(address){
      return {
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
