import { Component, OnInit, NgZone } from '@angular/core';
import { WeatherServiceService } from '../services/weather-service.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss'],
})
export class CitiesComponent implements OnInit {
  myArray: string[] = [];
  Cities: any[] = [];
  seletedCity=new BehaviorSubject<string>('');
  city: string = '';
  isDarkMode: boolean = false;


  constructor(
    private weatherService: WeatherServiceService,
    private cookieService: CookieService,
    private themeService: ThemeService,
  ) {}

  ngOnInit(): void {
      this.weatherService.cities$.subscribe(cities => {
      this.Cities = cities;
    });
    this.weatherService.fetchCities();
    this.seletedCity.subscribe(city => {
      this.city = city;
    });
    this.city = this.cookieService.get('seletedcityfromcities');

    this.themeService.theme$.subscribe((darkMode) => {
      this.isDarkMode = darkMode;
      
    });
  }


setSelectedCity(city: string) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30);
  this.seletedCity.next(city);
  this.cookieService.set('seletedcityfromcities', city,expirationDate);
}




}
