import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PhotoService } from '../../services/photo.service';
import { CameraCaptureComponent } from '../camera-capture/camera-capture.component';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [CommonModule, CameraCaptureComponent],
  template: `
    <div class="auth-dialog">
      <div class="content">
        <h2>Take a Selfie to Continue</h2>
        <p>We'll use this photo to identify you in the future.</p>
        <app-camera-capture (photoTaken)="onPhotoTaken($event)"></app-camera-capture>
      </div>
    </div>
  `,
  styles: [`
    .auth-dialog {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .content {
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      max-width: 500px;
      width: 90%;
    }

    h2 {
      margin-bottom: 0.5rem;
    }

    p {
      color: #666;
      margin-bottom: 2rem;
    }
  `]
})
export class AuthDialogComponent {
  constructor(
    private authService: AuthService,
    private photoService: PhotoService,
    private router: Router
  ) {}

  async onPhotoTaken(photoData: string) {
    try {
      // generate uuid 
      const uuid = crypto.randomUUID();      

      await this.authService.authenticate(uuid);
      const photoObservable = this.photoService.uploadPhoto(photoData)
      photoObservable.subscribe({
        next: (data) => {
          console.log('Received data:', data);
        },
        error: (error) => {
          console.error('An error occurred:', error);
        }
      });

      this.router.navigate(['/photos']);
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  }
} 