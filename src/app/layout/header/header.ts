import { Component, inject } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { LoadService } from '../../core/services/load.service';
import { MatProgressBar } from '@angular/material/progress-bar';
import { CartService } from '../../core/services/cart.service';
import { AccountService } from '../../core/services/account.service';

@Component({
  selector: 'app-header',
  imports: [MatIconModule,
    MatBadge,
    MatButton, RouterLink, RouterLinkActive, MatProgressBar],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  loadService = inject(LoadService);

  cartService = inject(CartService);

  accountSevice = inject(AccountService);

  router = inject(Router);

  logout(){
    this.accountSevice.logout().subscribe({
      next: () => { this.accountSevice.currentUser.set(null);
        this.router.navigateByUrl("/");
      }
    });
  }
}
