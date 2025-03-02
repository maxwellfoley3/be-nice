import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AuthDialogComponent } from './components/take-photo/take-photo.component';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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