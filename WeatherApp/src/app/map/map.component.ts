import { Component, ElementRef, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { WeatherServiceService} from '../services/weather-service.service';
import fetch from 'node-fetch';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: L.Map | null = null;
  marker: L.Marker | null = null;

  constructor(private weatherService: WeatherServiceService,private cookieService:CookieService) { }

  ngOnInit(): void {


    // Initialize the Leaflet map
    this.GetLocation();
  }

  // Function to handle map click event
  onMapClick(e: L.LeafletMouseEvent): void {
    if (!this.map) return; // Check if map is null

    const lat = e.latlng.lat.toFixed(2); // Extract latitude and round to 2 decimal places
    const lon = e.latlng.lng.toFixed(2); // Extract longitude and round to 2 decimal places

    // Call getWeather function from the service
    this.weatherService.getWeather(lat, lon)
      .subscribe(data => {
        console.log(data.weather[0].description);
        const temperatureCelsius = (data.main.temp - 273.15).toFixed(0); // Convert temperature to Celsius and round to 2 decimal places
        const feels_likeCelsius = (data.main.feels_like - 273.15).toFixed(0); // Convert temperature to Celsius and round to 2 decimal places
        let iconUrl: string;
        console.log(data);
        // Determine the icon based on weather condition
        switch (data.weather[0].description.toLowerCase()) {
          case 'sunny':
          case 'clear':
          case 'partly cloudy':
          case 'mostly sunny':
          case 'mostly clear':
          case 'scattered clouds':
          case 'fair':
          case 'clear sky':
              iconUrl = 'assets/img/sun.png';
              break;
          case 'rainy':
          case 'showers':
          case 'light rain':
          case 'moderate rain':
          case 'heavy rain':
          case 'drizzle':
          case 'thunderstorms':
          case 'chance of rain':
              iconUrl = 'assets/img/rain.png';
              break;
          case 'snowy':
          case 'snow showers':
          case 'light snow':
          case 'moderate snow':
          case 'heavy snow':
          case 'blizzard':
          case 'sleet':
          case 'freezing rain':
              iconUrl = 'assets/img/snow.png';
              break;
          case 'clouds':
          case 'overcast':
          case 'mostly cloudy':
          case 'broken clouds':
          case 'foggy':
          case 'hazy':
          case 'misty':
          case 'overcast clouds':
          case 'few clouds':
              iconUrl = 'assets/img/cloud.png';
              break;
          default:
              iconUrl = 'url_to_default_image.png';
      }


        const popupContent = `
          <div style="text-align: center;">
          <img src="${iconUrl}" alt="Marker Icon" style="width: 100px;"><br>
          </div>
          <span>Place</span>: ${data.name}<br>
          Feels like: ${feels_likeCelsius}°C<br>
          Temperature: ${temperatureCelsius}°C<br>
          Description: ${data.weather[0].description}<br>

        `;

        // Create a marker at the clicked coordinates
        this.marker = L.marker(e.latlng, { icon: L.icon({ iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png' }) })
          .addTo(this.map!);

        // Create a popup with the weather information and attach it to the marker
        this.marker.bindPopup(popupContent).openPopup();
      });
  }



  GetLocation() {
    const city = this.cookieService.get('city');
    const token = localStorage.getItem('token');
    this.weatherService.getUserInfo(token).subscribe(userInfo => {
      // Set a default location if city and userInfo.location are undefined
      const location = userInfo.location || city || 'rabat';
      console.log("location:", location);
  
      this.weatherService.getGeoLocation(location).subscribe(geoLocationData => {
        let lat = 34.020882;  // Default latitude for Rabat, Morocco
        let lon = -6.841650;  // Default longitude for Rabat, Morocco
  
        // Check if geoLocationData is valid and contains lat and lon
        if (geoLocationData && geoLocationData.length > 0) {
          const geoLocation = geoLocationData[0];
          if (geoLocation && typeof geoLocation.lat !== 'undefined' && typeof geoLocation.lon !== 'undefined') {
            lat = parseFloat(geoLocation.lat);
            lon = parseFloat(geoLocation.lon);
          }
        }
  
        // Initialize the Leaflet map with the latitude and longitude
        this.map = L.map('map').setView([lat, lon], 13);
  
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map!);
  
        // Attach click event listener to the map
        if (this.map) {
          this.map.on('click', this.onMapClick.bind(this));
        }
      }, error => {
        console.error("Error fetching geoLocation data:", error);
        // Use default coordinates if API call fails
        const defaultLat = 34.020882;
        const defaultLon = -6.841650;
        this.map = L.map('map').setView([defaultLat, defaultLon], 13);
      });
    });
  }
  

}
