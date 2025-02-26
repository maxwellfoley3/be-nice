import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PhotoService } from '../../services/photo.service';
import { AuthService } from '../../services/auth.service';
import { CommentService } from '../../services/comment.service';
import { CommonModule } from '@angular/common';
import { Comment } from '../../models/comment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-photo-comment',
  template: `
    <div class="photo-comment-container" *ngIf="photo">
      <img [src]="photo.imageUrl" alt="Photo" class="photo">
      
      <div class="comments-section">
        <h3>Comments</h3>
        
        <div class="comment-form">
          <textarea 
            [(ngModel)]="newComment" 
            placeholder="Add a comment..."
            rows="3"
          ></textarea>
          <button (click)="addComment()">Post Comment</button>
        </div>

        <div class="comments-list">
          <div class="comment" *ngFor="let comment of comments">
            <div class="comment-header">
              <span class="date">{{comment.createdAt | date}}</span>
            </div>
            <p class="content">{{comment.content}}</p>
            <button 
              *ngIf="currentUserId === comment.author.id"
              (click)="deleteComment(comment.id)"
              class="delete-btn"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .photo-comment-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .photo {
      width: 100%;
      max-height: 500px;
      object-fit: contain;
      margin-bottom: 2rem;
    }

    .comments-section {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h3 {
      margin-bottom: 1rem;
    }

    .comment-form {
      margin-bottom: 2rem;
    }

    textarea {
      width: 100%;
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
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

    .comment {
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }

    .comment-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .user {
      font-weight: bold;
    }

    .date {
      color: #666;
    }

    .content {
      margin: 0;
    }

    .delete-btn {
      margin-top: 0.5rem;
      background-color: #dc3545;
      font-size: 0.8rem;
      padding: 0.25rem 0.5rem;
    }

    .delete-btn:hover {
      background-color: #c82333;
    }
  `]
  ,
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PhotoCommentComponent implements OnInit {
  photo: any;
  comments: Comment[] = [];
  newComment: string = '';
  currentUserId: number | null;

  constructor(
    private route: ActivatedRoute,
    private photoService: PhotoService,
    private authService: AuthService,
    private commentService: CommentService
  ) {
    this.currentUserId = this.authService.getUserId();
  }

  ngOnInit() {
    const photoId = this.route.snapshot.params['id'];
    this.loadPhoto(photoId);
    this.loadComments(photoId);
  }

  loadPhoto(id: number) {
    this.photoService.getPhoto(id).subscribe(photo => {
      this.photo = photo;
    });
  }

  loadComments(photoId: number) {
    // Note: You'll need to implement this method in your PhotoService
    this.commentService.loadComments(photoId).subscribe(comments => {
      this.comments = comments;
    });
  }

  addComment() {
    if (!this.newComment.trim()) return;

    const photoId = this.route.snapshot.params['id'];
    // Note: You'll need to implement this method in your PhotoService
    this.commentService.addComment(photoId, this.newComment).subscribe({
      next: () => {
        this.loadComments(photoId);
        this.newComment = '';
      },
      error: (error) => console.error('Failed to add comment:', error)
    });
  }

  deleteComment(commentId: number) {
    if (confirm('Are you sure you want to delete this comment?')) {
      const photoId = this.route.snapshot.params['id'];
      // Note: You'll need to implement this method in your PhotoService
      this.commentService.deleteComment(commentId).subscribe({
        next: () => this.loadComments(photoId),
        error: (error) => console.error('Failed to delete comment:', error)
      });
    }
  }
}
