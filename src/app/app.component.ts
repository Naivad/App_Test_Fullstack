import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="container py-4">
      <h1 class="text-center mb-4">Flight Search System</h1>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {}