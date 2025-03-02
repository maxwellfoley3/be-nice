import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PhotoService } from '../../services/photo.service';
import { AuthService } from '../../services/auth.service';
import { Photo } from '../../models/photo';

@Component({
  selector: 'app-photo-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.scss']
})
export class PhotoListComponent implements OnInit {
  photos: Photo[] = [];
  showUploadModal = false;
  currentUserId: string | null = null;

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
      this.photos = photos.reverse();
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