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
  seletedCity = new BehaviorSubject<string>('');
  city: string = '';
  isDarkMode: boolean = false;
  weatherData: any;
  temperatureValue: string = 'C';
  weatherDataForecast: any[] = [];
  threeDayForecast: any[] = [];
  cityWeatherData: any = {}; // Object to hold weather data for each city

  constructor(
    private weatherService: WeatherServiceService,
    private cookieService: CookieService,
    private themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    this.weatherService.cities$.subscribe(cities => {
      this.Cities = cities;
      this.Cities.forEach(city => {
        this.updateCityWeather(city);
      });
    });
  
    this.weatherService.fetchCities();
  
    this.seletedCity.subscribe(city => {
      this.city = city;  
      if (city) {
        this.updateCityWeather(city);  
      }
    });
  
    this.city = this.cookieService.get('seletedcityfromcities');
    
    if (this.city) {
      this.updateCityWeather(this.city);  
    }
  
    this.themeService.theme$.subscribe((darkMode) => {
      this.isDarkMode = darkMode;
    });

    if (this.cookieService.check('temperature')) {
      this.temperatureValue = this.cookieService.get('temperature');
    }
  }

  setSelectedCity(city: string) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
  
    this.seletedCity.next(city);  
    this.cookieService.set('seletedcityfromcities', city, expirationDate);
  
    this.city = city; 
    this.updateCityWeather(city);
  }
  

  updateCityWeather(city: string) {
    this.cityWeather(city);  
    this.WeatherForecast(city);  
  }

  cityWeather(city: string) {
    this.weatherService.getCurrentWeather(city).subscribe((data) => {
      this.cityWeatherData[city] = data;

      if (this.cityWeatherData[city]?.main) {
        this.cityWeatherData[city].main.temp = this.convertKelvinToCelsius(this.cityWeatherData[city].main.temp);
        this.cityWeatherData[city].main.feels_like = this.convertKelvinToCelsius(this.cityWeatherData[city].main.feels_like);
      }
    });
  }

  convertKelvinToCelsius(tempInKelvin: number): number {
    return Math.round(tempInKelvin - 273.15);
  }

  getWeatherIcon(weatherCondition: string): string {
    switch (weatherCondition) {
      case 'Snow':
        return 'assets/img/snow.png';
      case 'Rain':
        return 'assets/img/rain.png';
      case 'Clouds':
        return 'assets/img/cloud_weather.png';
      case 'Clear':
      case 'Sun':
        return 'assets/img/sun.png';
      default:
        return 'assets/img/cloud_weather.png';
    }
  }

  getCityTime(city: string): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  WeatherForecast(city: string): void {
    this.weatherService.getGeoLocation(city).subscribe((data: any) => {
      const lat = data[0].lat;
      const lon = data[0].lon;

      this.weatherService.getThreeTimeForecast(lat, lon).subscribe((threeTimeForecast: any) => {
        this.weatherDataForecast = threeTimeForecast;

        this.weatherService.getThreeDayForecast(lat, lon).subscribe((threeDayForecast: any) => {
          this.threeDayForecast = threeDayForecast;  
        });
      });
    });
  }
}
