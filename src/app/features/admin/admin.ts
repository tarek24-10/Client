import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Order } from '../../shared/models/order';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AdminService } from '../../core/services/admin.service';
import { OrderParams } from '../../shared/models/orderParams';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs'
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [MatTableModule, MatPaginatorModule, MatButton, MatIcon, MatSelectModule, DatePipe, CurrencyPipe, MatLabel,
    MatTooltipModule, MatTabsModule, MatFormField, RouterLink, MatIconButton],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  private adminService = inject(AdminService);
  orderParams = new OrderParams();
  totalItems = 0;
  statusOption = ['All', 'PaymentReceived', 'PaymentMismatch', 'Refunded', 'Pending']

  displayedColumns: string[] = ['id', 'buyerEmail', 'orderDate', 'total', 'status', 'action'];
  dataSource = new MatTableDataSource<Order>([]);

  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.loadOrders();
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }

  loadOrders(){
    this.adminService.getOrders(this.orderParams).subscribe({
      next: paginated => {
        if(paginated.data){
          this.dataSource.data = paginated.data
          this.totalItems = paginated.count
        }
      }
    })
  }

  onPageChange(event:PageEvent){
    this.orderParams.pageNumber = event.pageIndex + 1;
    this.orderParams.pageSize = event.pageSize;
    this.loadOrders();
  }

  onFilterSelect(event:MatSelectChange){
    this.orderParams.filter = event.value;
    this.orderParams.pageNumber = 1;
    this.loadOrders();
  }
}
