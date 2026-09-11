import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-success',
  imports: [MatButton, RouterLink],
  templateUrl: './success.html',
  styleUrl: './success.css',
})
export class Success {

}
