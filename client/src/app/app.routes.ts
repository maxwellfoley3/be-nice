import { Routes } from '@angular/router';
import { PhotoListComponent } from './components/photo-list/photo-list.component';
import { AuthDialogComponent } from './components/take-photo/take-photo.component';
import { PhotoCommentComponent } from './components/photo-comment/photo-comment.component';
import { PhotoGuardService } from './guards/photo-guard-service';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

export const routes: Routes = [
    { path: '', component: PhotoListComponent, canActivate: [PhotoGuardService] },
    { path: 'take-photo', component: AuthDialogComponent },
    { path: 'photos/:id', component: PhotoCommentComponent, canActivate: [PhotoGuardService] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [PhotoGuardService]
})
export class AppRoutes {}