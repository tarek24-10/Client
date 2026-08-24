import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./layout/header/header";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = 'E-Commerce';

  private baseUrl = "https://localhost:5001/api/";
  private http = inject(HttpClient);
  products:any[] = []

  ngOnInit(): void {
    this.http.get<any>(this.baseUrl + "products").subscribe({
      next: responce => this.products = responce.value.data,
      error: error => console.log(error),
      complete: () => console.log("Complete") 
    });
  }
}
