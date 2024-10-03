import { Component, OnInit, inject,NgZone  } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { WeatherServiceService} from '../services/weather-service.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ThemeService } from '../services/theme.service';
interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    sea_level: number;
  };
  wind: {
    speed: number;
  };

  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;

}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit  {
  isLoading = true;
  selectedCity: string = '';
  weatherData: WeatherData | null = null;
  cols = 1;
  colss=2;
  colsss=1;
  row=1;
  isheadset=false;
  temperatureValue: string = 'C';
  windSpeedValue: string="";
  humidityValue: string="";
  seaLevelValue: string="";
  weatherDataForecast: any[] = [];
  sevenDayForecast: any[] = [];
  is12Hour: boolean = false;
  isDarkMode!: boolean;

  constructor(private breakpointObserver: BreakpointObserver,private weatherService: WeatherServiceService,private zone: NgZone,private route: ActivatedRoute,private cookieService: CookieService,private themeService: ThemeService) {

    this.breakpointObserver.observe(Breakpoints.Handset).subscribe((result)=>{
      if(result.matches){
        this.cols=3;
        this.colss=3;
        this.row=2;
        this.isheadset=true
      }
      else{
        this.cols=1;
        this.colss=2;
        this.row=1;
        this.isheadset=false
      }

    })

  }

  ngOnInit(): void {
    //const weatherData = this.route.snapshot.data['weather'];

    this.weatherService.getSelectedCity().subscribe(city => {
      this.zone.run(() => {
        this.selectedCity = city|| 'Milan';
        //Get the current weather of the selected city wind speed, humidity, pressure, temperature
        this.getWeather();

        this.WeatherForecast(this.selectedCity);

      });
    });


    this.is12Hour=this.cookieService.get('hourTime') === 'true' ? true : false;
    //load the temperature unit from the cookie
    this.loadUnitsFromCookie();

    this.themeService.theme$.subscribe((darkMode) => {
      this.isDarkMode = darkMode;
      
    });


  }

  getWeather() {
    if (this.selectedCity) {
      this.weatherService.getCurrentWeather(this.selectedCity)
        .subscribe((data: any) => {
          console.log(data);
          this.zone.run(() => {
            // Convert temperature from Kelvin to Celsius
            data.main.temp = this.kelvinToCelsius(data.main.temp);
            data.main.feels_like=this.kelvinToCelsius(data.main.feels_like);
            this.weatherData = data;
          });
        });
    }
  }


   // Function to convert temperature from Kelvin to Celsius
   kelvinToCelsius(kelvin: number): number {
    return Math.floor(kelvin - 273.15);
  }


  loadUnitsFromCookie(): void {
    // Check and load temperature unit from cookie
    if (this.cookieService.check('temperature')) {
      this.temperatureValue = this.cookieService.get('temperature');
    } else {


    }

    // Check and load wind speed unit from cookie
    if (this.cookieService.check('windSpeed')) {
      this.windSpeedValue = this.cookieService.get('windSpeed');
    } else {
      // Default to 'Km/h' if no cookie found
      this.windSpeedValue = 'Km/h';
    }

    // Check and load pressure unit from cookie
    if (this.cookieService.check('humidity')) {
      this.humidityValue= this.cookieService.get('humidity');
    } else {
      // Default to 'Pa' if no cookie found
      this.humidityValue = '%';
    }

    // Check and load distance unit from cookie
    if (this.cookieService.check('seaLevel')) {
      this.seaLevelValue = this.cookieService.get('seaLevel');
    } else {
      // Default to 'Km' if no cookie found
      this.seaLevelValue = 'hPa';
    }
  }



  // Function to get weather forecast for a given city
  WeatherForecast(City: string): void {
    // Get the geolocation of the city (lat and lon)
    this.weatherService.getGeoLocation(City).subscribe((data: any) => {
      console.log(data);
      const lat = data[0].lat;
      const lon = data[0].lon;
  
      // Get the forecast for the first 6 time entries using lat/lon
      this.weatherService.getTodayForecast(lat, lon).subscribe((todayForecast: any) => {
        this.weatherDataForecast = todayForecast;  // Store the first 6 time entries for today
        console.log('Today\'s Forecast:', this.weatherDataForecast);
  
        // Optional: Process the full 7-day forecast if you still need it
        this.weatherService.getForecastWeather(lat, lon).subscribe((forecastData: any) => {
          this.sevenDayForecast = this.weatherService.processWeatherData(forecastData.list);  // Process 7-day forecast
          console.log(this.sevenDayForecast);
        });
      });
    });
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
        return 'assets/img/default.png';
    }
  }
  

}
