import { Component, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PhotoService } from '../../services/photo.service';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './take-photo.component.html',
  styleUrls: ['./take-photo.component.scss']
})
export class AuthDialogComponent {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  
  photoTaken = false;
  stream: MediaStream | null = null;

  constructor(
    private authService: AuthService,
    private photoService: PhotoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initCamera();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  private async initCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (this.videoElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
      }
    } catch (error) {
      console.error('Camera access denied:', error);
    }
  }

  private stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  takePhoto() {
    this.photoTaken = true;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.style.display = 'block';
    context.scale(-1, 1); // Mirror the image
    context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    
    this.stopCamera();
  }

  retakePhoto() {
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) return;
    // clear the canvas
    canvas.style.display = 'none';
    console.log('cleared canvas');

    this.photoTaken = false;
    this.initCamera();
  }

  async acceptPhoto() {
    try {
      const canvas = this.canvasElement.nativeElement;
      const photoData = canvas.toDataURL('image/jpeg');
      
      // First authenticate
      if (!this.authService.isAuthenticated()) {
        await this.authService.authenticate();
      }
      
      // Then upload the photo
      await this.photoService.uploadPhoto(photoData).toPromise();

      // Navigate to photos page
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Failed to process photo:', error);
    }
  }
} 