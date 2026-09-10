import { Component } from '@angular/core';
import { OrderSummary } from "../../shared/components/order-summary/order-summary";
import {MatStepperModule} from '@angular/material/stepper';

@Component({
  selector: 'app-checkout',
  imports: [OrderSummary, MatStepperModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {

}
