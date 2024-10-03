import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-oauth2-callback',
  templateUrl: './oauth2-callback.component.html',
  styleUrls: ['./oauth2-callback.component.scss']
})
export class Oauth2CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUrl = window.location.href;
    console.log('Current full URL:', currentUrl);
    this.route.queryParams.subscribe((params) => {
      console.log('Query parameters:', params);
      const token = params['token'];
      const refreshToken = params['refresh_token'];

      if (token && refreshToken) {
        // Store the tokens in AuthService
        this.authService.setTokens(token, refreshToken);

        // Mark the user as authenticated
        this.authService.isAuthenticated.next(true);

        // Redirect to the home page or another page
        this.router.navigate(['/']);
      } else {
        console.error('OAuth2 callback failed, tokens not found.');
        // Optionally redirect to login page if tokens are missing
        this.router.navigate(['/auth']);
      }
    });
  }

}
