import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { PhotoService } from '../services/photo.service';

@Injectable({
    providedIn: 'root'
})
export class PhotoGuardService implements CanActivate {
    constructor(
        private authService: AuthService,
        private photoService: PhotoService,
        private router: Router
    ) {}
 
    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        const userId = this.authService.getUserId();
        if (!userId) {
            this.router.navigate(['/take-photo']);
            return false;
        }

        try {
            const photos = await firstValueFrom(this.photoService.getPhotosByUser(userId));
            if (!photos.length) {
                this.router.navigate(['/take-photo']);
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error checking photos:', error);
            this.router.navigate(['/take-photo']);
            return false;
        }
    }
}

