import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../constants';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private http: HttpClient) {}

  loadComments(photoId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${API_URL}/comments/photo/${photoId}`);
  }

  addComment(photoId: number, content: string): Observable<Comment> {
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.post<Comment>(`${API_URL}/comments`, { photoId, content }, { headers });
  }

  deleteComment(commentId: number): Observable<void> {
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.delete<void>(`${API_URL}/comments/${commentId}`, { headers });
  }
}
