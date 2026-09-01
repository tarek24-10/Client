import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/select';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-summary',
  imports: [MatButton, RouterLink, MatFormField, MatLabel, MatInput],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.css',
})
export class OrderSummary {

}
