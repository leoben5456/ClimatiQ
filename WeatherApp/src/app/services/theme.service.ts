import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject: BehaviorSubject<boolean>;
  public theme$: Observable<boolean>;

  constructor(private cookieService: CookieService) {
    const darkModeCookie = this.cookieService.get('darkMode');
    const initialTheme = darkModeCookie ? darkModeCookie === 'true' : false; 
    this.themeSubject = new BehaviorSubject<boolean>(initialTheme);
    this.theme$ = this.themeSubject.asObservable();
  }

  setTheme(isDarkMode: boolean): void {
    this.themeSubject.next(isDarkMode);
    this.cookieService.set('darkMode', String(isDarkMode));
  }

  getTheme(): boolean {
    return this.themeSubject.value;
  }
}
