import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PhotoService } from '../../services/photo.service';
import { AuthService } from '../../services/auth.service';
import { CameraCaptureComponent } from '../camera-capture/camera-capture.component';
import { Photo } from '../../models/photo';

@Component({
  selector: 'app-photo-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CameraCaptureComponent],
  template: `
    <div class="photo-list-container">
      <div class="header">
        <h2>Photos</h2>
        <button (click)="showUploadModal = true">Upload Photo</button>
      </div>

      @if (showUploadModal) {
        <div class="upload-modal">
          <div class="modal-content">
            <h3>Take a Photo</h3>
            <app-camera-capture (photoTaken)="onPhotoTaken($event)"></app-camera-capture>
            <button (click)="showUploadModal = false">Cancel</button>
          </div>
        </div>
      }

      <div class="photo-grid">
        @for (photo of photos; track photo.id) {
          <div class="photo-card">
            <a [routerLink]="['/photos', photo.id]">
              <img [src]="photo.imageUrl" [alt]="'Photo by user ' + photo.userId" />
            </a>
            <div class="photo-info">
              <span>Posted by user {{ photo.userId }}</span>
              @if (photo.userId === currentUserId) {
                <button (click)="deletePhoto(photo.id)">Delete</button>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .photo-list-container {
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .photo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .photo-card {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .photo-card img {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }

    .photo-info {
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .upload-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .modal-content {
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
    }

    button {
      padding: 0.5rem 1rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover {
      background-color: #0056b3;
    }
  `]
})
export class PhotoListComponent implements OnInit {
  photos: Photo[] = [];
  showUploadModal = false;
  currentUserId: number | null = null;

  constructor(
    private photoService: PhotoService,
    private authService: AuthService
  ) {
    this.currentUserId = this.authService.getUserId();
  }

  ngOnInit() {
    this.loadPhotos();
  }

  loadPhotos() {
    this.photoService.getAllPhotos().subscribe(photos => {
      this.photos = photos;
    });
  }

  onPhotoTaken(photoData: string) {
    this.photoService.uploadPhoto(photoData).subscribe({
      next: () => {
        this.loadPhotos();
        this.showUploadModal = false;
      },
      error: (error) => console.error('Upload failed:', error)
    });
  }

  deletePhoto(id: number) {
    if (confirm('Are you sure you want to delete this photo?')) {
      this.photoService.deletePhoto(id).subscribe({
        next: () => this.loadPhotos(),
        error: (error) => console.error('Delete failed:', error)
      });
    }
  }
} 