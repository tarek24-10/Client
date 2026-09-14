import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Order } from '../../../shared/models/order';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { CardPipe } from '../../../shared/pipes/card-pipe';
import { AccountService } from '../../../core/services/account.service';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-order-detailed',
  imports: [MatCardModule, MatButton, DatePipe, CurrencyPipe, AddressPipe, CardPipe, RouterLink],
  templateUrl: './order-detailed.html',
  styleUrl: './order-detailed.css',
})
export class OrderDetailed  implements OnInit {
  private orderService = inject(OrderService);
  private activatedRoute = inject(ActivatedRoute);
  order =signal<Order | undefined>(undefined);

  private accountService = inject(AccountService);
  buttonText = this.accountService.isAdmin() ? "Return to admin" : "Return to orders";
  router = inject(Router);
  private adminService = inject(AdminService);

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(!id) return;

    const loadOrderData = this.accountService.isAdmin() ? this.adminService.getOrder(+id) : this.orderService.getOrderDetailed(+id);

    loadOrderData.subscribe({
      next: order => this.order.set(order)
    })
  }

  onReturnClick(){
    this.accountService.isAdmin() ? this.router.navigateByUrl('/admin') : this.router.navigateByUrl('/orders')
  }
}
