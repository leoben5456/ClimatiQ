import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap, BehaviorSubject, switchMap, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { PreferencesService } from './preferences.service';
import { WeatherServiceService } from './weather-service.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/weather/api/token/';
  private refreshTokenUrl = 'http://127.0.0.1:8000/weather/api/token/refresh/';

  // Observable to track authentication status
  public isAuthenticated = new BehaviorSubject<boolean>(this.hasValidToken());

  constructor(private http: HttpClient, private router: Router,private preferencesService: PreferencesService,private weatherService: WeatherServiceService) {}

  login(credentials: any): Observable<any> {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap((response: any) => {
        this.setTokens(response.access, response.refresh);
        this.isAuthenticated.next(true);
      }),
      switchMap(() => {
        // Use forkJoin to load both preferences and user info in parallel
        return forkJoin({
          preferences: this.preferencesService.loadPreferencesFromDatabase(),
          userInfo: this.preferencesService.loadUserCityFromDatabase(),
        });
      }),
      tap((result: any) => {
        console.log('Preferences and user city loaded:', result);
        this.preferencesService.savePreferencesToCookies({
          ...result.preferences,
          city: result.userInfo.City,
        });
        console.log('Preferences and user city saved to cookies');
  
        // Call initializeSelectedCity after saving preferences
        this.weatherService.initializeSelectedCity();
      })
    );
  }


  refreshToken(): Observable<any> {
    const refresh = this.getRefreshToken();
    return this.http.post(this.refreshTokenUrl, { refresh }).pipe(
      tap((response: any) => {
        this.setAccessToken(response.access);
      })
    );
  }

  setTokens(access: string, refresh: string): void {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  setAccessToken(access: string): void {
    localStorage.setItem('access_token', access);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  isAccessTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    const decoded: any = jwtDecode(token);
    const exp = decoded.exp;
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  }

  // Check if there is a valid access token
  private hasValidToken(): boolean {
    const token = this.getAccessToken();
    return token != null && !this.isAccessTokenExpired();
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isAuthenticated.next(false);
    this.router.navigate(['/auth']);
  }
}


