import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AuthDialogComponent } from './components/auth-dialog/auth-dialog.component';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="container">
      <h1>Be Nice</h1>
      <router-outlet/>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      text-align: center;
      color: #333;
    }
  `],
})

export class AppComponent {
  isAuthenticated = false;

  constructor(private authService: AuthService) {
    /*
    this.authService.isAuthenticated.subscribe(
      isAuth => this.isAuthenticated = isAuth
    );*/
  }
} 