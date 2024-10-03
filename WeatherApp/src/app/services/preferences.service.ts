import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  preferences: any;
  userInfo: any;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  loadPreferencesFromDatabase() {
    return this.http.get('http://127.0.0.1:8000/weather/user/preferences');
  }

  loadUserCityFromDatabase() {
    return this.http.get('http://127.0.0.1:8000/weather/user/info/');
  }

  
  savePreferencesToCookies(preferences: any) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    this.cookieService.set('temperature', preferences.temperature, expirationDate);
    this.cookieService.set('windSpeed', preferences.windSpeed, expirationDate);
    this.cookieService.set('seaLevel', preferences.seaLevel, expirationDate);
    this.cookieService.set('humidity', preferences.humidity, expirationDate);
    this.cookieService.set('notification', String(preferences.notification), expirationDate);
    this.cookieService.set('hourTime', String(preferences.hourTime), expirationDate);
    this.cookieService.set('location', String(preferences.location), expirationDate);
    this.cookieService.set('darkMode', String(preferences.darkMode), expirationDate);

    // Fix: Access 'city' from the 'preferences' object passed into the method
    if (preferences.city) {
      this.cookieService.set('city', preferences.city, expirationDate);
    } else {
      console.warn('City information is missing in the preferences object.');
    }
  }

}
