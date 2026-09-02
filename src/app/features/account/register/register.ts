import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/select';
import { AccountService } from '../../../core/services/account.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatCard, MatFormField, MatLabel, MatInput, MatButton, JsonPipe],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder)

  accountService = inject(AccountService);
  private router = inject(Router);

  private snack = inject(SnackbarService);

  registerForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    email: [''],
    password: ['']
  });

  onSubmit(){
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => { this.snack.success("Registeration successful - now you can login");
        this.router.navigateByUrl("/account/login");
      }

    })
  }
}
