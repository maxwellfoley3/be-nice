import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../constants';
import { Photo } from '../models/photo';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  constructor(private http: HttpClient) {}

  getAllPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${API_URL}/photos`);
  }

  getPhoto(id: number): Observable<Photo> {
    return this.http.get<Photo>(`${API_URL}/photos/${id}`);
  }

  uploadPhoto(photoData: string): Observable<Photo> {
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.post<Photo>(`${API_URL}/photos`, { photo: photoData }, { headers })
  }

  deletePhoto(id: number): Observable<void> {
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.delete<void>(`${API_URL}/photos/${id}`, { headers });
  }

  getPhotosByUser(userId: string): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${API_URL}/photos/user/${userId}`);
  }
} 