import { Routes } from '@angular/router';
import { PhotoListComponent } from './components/photo-list/photo-list.component';
import { AuthDialogComponent } from './components/auth-dialog/auth-dialog.component';
import { PhotoCommentComponent } from './components/photo-comment/photo-comment.component';

export const routes: Routes = [
    { path: 'auth', component: AuthDialogComponent },
    { path: 'photos', component: PhotoListComponent },
    { path: 'photos/:id', component: PhotoCommentComponent }
];
