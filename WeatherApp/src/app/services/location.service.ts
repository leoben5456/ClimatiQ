import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

constructor(private http:HttpClient) { }

// Get user location (latitude and longitude)
getUserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject('Geolocation is not supported by this browser.');
    }
  });
}
// Get location name using Google Maps API
getLocationName(lat: number, lon: number): Observable<any> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
  return this.http.get(url);
}


}
