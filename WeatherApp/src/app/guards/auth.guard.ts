import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    if (
      this.authService.getAccessToken() &&
      !this.authService.isAccessTokenExpired()
    ) {
      return of(true);
    } else if (this.authService.getRefreshToken()) {
      return this.authService.refreshToken().pipe(
        map(() => true),
        catchError(() => {
          this.authService.logout();
          this.router.navigate(['/auth']);
          return of(false);
        })
      );
    } else {
      this.router.navigate(['/auth']);
      return of(false);
    }
  }
}
