import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-test-error',
  imports: [MatButton],
  templateUrl: './test-error.html',
  styleUrl: './test-error.css',
})
export class TestError {

  private http = inject(HttpClient);

  get404Error() {
    this.http.get('https://localhost:5001/api/error/notfound').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }

  get400Error() {
    this.http.get('https://localhost:5001/api/error/badrequest').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }

  get401Error() {
    this.http.get('https://localhost:5001/api/error/unauthorized').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }

  get500Error() {
    this.http.get('https://localhost:5001/api/error/internalerror').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }

  get400ValidationError() {
    this.http.post('https://localhost:5001/api/error/validationerror', {}).subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }
}
