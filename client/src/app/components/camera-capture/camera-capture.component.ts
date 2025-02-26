import { Component, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-camera-capture',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="camera-container">
      <canvas #canvasElement></canvas>

      @if (!photoTakenState) {
        <video #videoElement autoplay playsinline></video>
        <div class="controls">
          <button (click)="takePhoto()">Take Photo</button>
        </div>
      } @else {
        <div class="controls">
          <button (click)="retakePhoto()">Retake</button>
          <button (click)="acceptPhoto()">Accept</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .camera-container {
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
      text-align: center;
    }

    video, canvas {
      width: 100%;
      border-radius: 8px;
      margin-bottom: 1rem;
      transform: scaleX(-1); /* Mirror effect for selfie */
    }

    .controls {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    button {
      padding: 0.75rem 1.5rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    button:hover {
      background-color: #0056b3;
    }
  `]
})
export class CameraCaptureComponent {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  @Output() photoTaken = new EventEmitter<string>();

  private stream: MediaStream | null = null;
  photoTakenState = false;

  async ngOnInit() {
    await this.initCamera();
  }

  ngOnDestroy() {
    this.stopStream();
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

  private stopStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  takePhoto() {
    if (!this.videoElement || !this.canvasElement) return;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Apply mirror effect when drawing to canvas
    context.scale(-1, 1);
    context.translate(-canvas.width, 0);
    context.drawImage(video, 0, 0);
    
    // Reset transform
    context.setTransform(1, 0, 0, 1, 0, 0);

    this.photoTakenState = true;
    this.stopStream();
  }

  retakePhoto() {
    this.photoTakenState = false;
    this.initCamera();
  }

  acceptPhoto() {
    if (!this.canvasElement) return;
    
    const photoData = this.canvasElement.nativeElement.toDataURL('image/jpeg');
    this.photoTaken.emit(photoData);
  }
} 