import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { OrderSummary } from "../../shared/components/order-summary/order-summary";
import {MatStepperModule} from '@angular/material/stepper';
import { RouterLink } from "@angular/router";
import { MatAnchor, MatButton } from "@angular/material/button";
import { StripeService } from '../../core/services/stripe.service';
import { StripeAddressElement } from '@stripe/stripe-js';
import { SnackbarService } from '../../core/services/snackbar.service';

@Component({
  selector: 'app-checkout',
  imports: [OrderSummary, MatStepperModule, RouterLink, MatAnchor, MatButton],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit, OnDestroy {
  private stripeSevice = inject(StripeService);
  private addressElement?: StripeAddressElement;

  private snackbar = inject(SnackbarService);

  async ngOnInit(){
    try{
        this.addressElement = await this.stripeSevice.createAddressElement();
        this.addressElement.mount('#address-element')
    }
    catch(error : any){
      this.snackbar.error(error.message)
    }
  }

  ngOnDestroy(): void {
    this.stripeSevice.disposeElements();
  }
}
