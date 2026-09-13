import { Component, inject, OnDestroy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SignalrService } from '../../../core/services/signalr.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { CardPipe } from '../../../shared/pipes/card-pipe';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-success',
  imports: [MatButton, RouterLink, MatProgressSpinnerModule, DatePipe, AddressPipe, CardPipe, CurrencyPipe],
  templateUrl: './success.html',
  styleUrl: './success.css',
})
export class Success implements OnDestroy {
  signalrService = inject(SignalrService);
  orderService = inject(OrderService);

  ngOnDestroy(): void {
    this.orderService.orderComplete = false;
    this.signalrService.order.set(null);
  }
}
