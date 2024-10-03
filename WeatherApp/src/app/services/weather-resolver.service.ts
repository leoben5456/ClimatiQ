import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { WeatherServiceService } from './weather-service.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherResolverService implements Resolve<any> {

  constructor(private weatherService: WeatherServiceService) { }
  resolve(route: ActivatedRouteSnapshot) {
    const city = route.paramMap.get('city') || 'rabat';
    return this.weatherService.getCurrentWeather(city);
  }
}
