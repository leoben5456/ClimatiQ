import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError, map, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class WeatherServiceService {
  private selectedCitySubject = new BehaviorSubject<string>('');
  apiKey = "9b5ab21d3ccd5d8bfd54e9481ac4ea91"
  private apiUrl = 'http://api.geonames.org/searchJSON';
  private username = 'leoben';
  private citiesSubject = new BehaviorSubject<any[]>([]);
  cities$ = this.citiesSubject.asObservable();

  constructor(private http: HttpClient, private cookieService: CookieService) {
    const currentLocation = localStorage.getItem('location');
    const isLocationSet = this.cookieService.get('location') == 'true' ? true : false;
    let storedCity: string;

    storedCity = this.cookieService.get('city') || 'milan';

    if (isLocationSet) {
      storedCity = currentLocation || 'rabat';
      this.selectedCitySubject = new BehaviorSubject<string>(storedCity);
    }

    this.selectedCitySubject.next(storedCity);
  }

  initializeSelectedCity(): void {
    const currentLocation = localStorage.getItem('location');
    const isLocationSet = this.cookieService.get('location') === 'true';

    if (isLocationSet) {
      const storedCity = currentLocation || 'milan';
      this.selectedCitySubject.next(storedCity);
    } else {
      this.fetchLocationFromDatabase().subscribe(
        (cityFromDB) => {
          this.selectedCitySubject.next(cityFromDB || 'Milan');
        },
        (error) => {
          console.error('Error fetching location from database:', error);
          this.selectedCitySubject.next('Milan');
        }
      );
    }
  }

  fetchLocationFromDatabase(): Observable<string> {
    const url = 'http://127.0.0.1:8000/weather/user/info/';
    return this.http.get<{ City: string }>(url).pipe(
      map((response) => response.City),
      catchError((error) => {
        console.error('Error in fetchLocationFromDatabase:', error);
        return of('Milan'); // Replace 'Milan' with your default city
      })
    );
  }

  getCurrentWeather(city: string) {
    return this.http.get<any>(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}`);
  }

  getWeather(lat: string, lon: string) {
    return this.http.get<any>(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}`);
  }

  getCities(query: string, maxRows: number): Observable<any> {
    const url = `${this.apiUrl}?q=${query}&maxRows=${maxRows}&username=${this.username}`;
    return this.http.get(url);
  }

  setSelectedCity(city: string): void {
    this.selectedCitySubject.next(city);
  }

  getSelectedCity(): BehaviorSubject<string> {
    return this.selectedCitySubject;
  }

  getGeoLocation(City: string) {
    return this.http.get<any>(`http://api.openweathermap.org/geo/1.0/direct?q=${City}&limit=1&appid=${this.apiKey}`);
  }

  getForecastWeather(lat: string, lon: string): Observable<any> {
    return this.http.get<any>(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}`);
  }

  getUserInfo(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`http://127.0.0.1:8000/weather/user/info/`, { headers: headers });
  }

  getDayOfWeek(unixTimestamp: number): string {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(unixTimestamp * 1000);
    return daysOfWeek[date.getUTCDay()];
  }

  processWeatherData(forecastArray: any[]): any[] {
    const dailyForecast: any = {};

    forecastArray.forEach((item) => {
      const dayOfWeek = this.getDayOfWeek(item.dt);
      const temperatureInCelsius = Math.round(item.main.temp - 273.15);
      const weatherCondition = item.weather[0].main;

      if (!dailyForecast[dayOfWeek]) {
        dailyForecast[dayOfWeek] = {
          day: dayOfWeek,
          temperature: temperatureInCelsius,
          weather: weatherCondition,
        };
      } else {
        dailyForecast[dayOfWeek].temperature = temperatureInCelsius;
        dailyForecast[dayOfWeek].weather = weatherCondition;
      }
    });

    return Object.values(dailyForecast).slice(0, 7);
  }

  fetchCities(): void {
    const CityApi = 'http://127.0.0.1:8000/weather/user/cities';
    this.http.get<any[]>(CityApi).subscribe(citiesFromBackend => {
      const cityNames = citiesFromBackend.map(city => city.name);
      this.citiesSubject.next(cityNames);
    });
  }

  addCity(cityName: string): Observable<any> {
    const body = { city_name: cityName };
    return this.http.post<any>('http://127.0.0.1:8000/weather/add/city/', body).pipe(
      tap(response => {
        const currentCities = this.citiesSubject.getValue();
        this.citiesSubject.next([...currentCities, response.name]);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  // Function to get today's forecast (first 6 time entries)
  getTodayForecast(lat: string, lon: string): Observable<any[]> {
    return this.getForecastWeather(lat, lon).pipe(
      map((response) => {
        const forecastArray = response.list.slice(0, 6);  // Get only the first 6 forecast entries
        return forecastArray.map((item: { dt: number; main: { temp: number; }; weather: { main: any; }[]; }) => ({
          time: this.formatTime(item.dt),  // Convert UNIX time to readable time
          temperature: Math.round(item.main.temp - 273.15),  // Convert Kelvin to Celsius
          weather: item.weather[0].main
        }));
      })
    );
  }

  // Helper function to format time from UNIX timestamp
  formatTime(unixTimestamp: number): string {
    const date = new Date(unixTimestamp * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
