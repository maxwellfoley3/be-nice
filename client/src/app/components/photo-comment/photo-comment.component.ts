import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PhotoService } from '../../services/photo.service';
import { AuthService } from '../../services/auth.service';
import { CommentService } from '../../services/comment.service';
import { CommonModule } from '@angular/common';
import { Comment } from '../../models/comment';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-photo-comment',
  templateUrl: './photo-comment.component.html',
  styleUrls: ['./photo-comment.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class PhotoCommentComponent implements OnInit {
  photo: any;
  comments: Comment[] = [];
  newComment: string = '';
  currentUserId: string | null;
  negativeSentiment = false;
  positiveSentiment = false;
  showServiceUnavailable = false;
  loading = false;
  math = Math;

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

  averageSentiment(comments: Comment[]) {
    const totalSentiment = comments.reduce((sum, comment) => sum + comment.sentimentScore, 0);
    return totalSentiment / comments.length;
  }

  addComment() {
    this.negativeSentiment = false;
    this.positiveSentiment = false;
    this.loading = true;
    if (!this.newComment.trim()) return;

    const photoId = this.route.snapshot.params['id'];
    // Note: You'll need to implement this method in your PhotoService
    this.commentService.addComment(photoId, this.newComment).subscribe({
      next: () => {
        this.showServiceUnavailable = false;
        this.loading = false;
        this.positiveSentiment = true;
        this.loadComments(photoId);
        this.newComment = '';
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 503) {
          this.showServiceUnavailable = true;
        }
        if (error.status === 400 && error.error.message === 'Comment is negative') {
          this.negativeSentiment = true;
        } else {
          console.error('Failed to add comment:', error);
        }
      }
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
