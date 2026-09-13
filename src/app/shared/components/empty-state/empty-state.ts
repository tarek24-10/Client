import { Component, inject, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { LoadService } from '../../../core/services/load.service';

@Component({
  selector: 'app-empty-state',
  imports: [MatButton,MatIcon,RouterLink],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyState {
  message = input.required<string>();
  icon = input.required<string>();
  actionText = input.required<string>();
  action = output<void>();
  loadService = inject(LoadService)

  onAction(){
    this.action.emit();
  }
}
