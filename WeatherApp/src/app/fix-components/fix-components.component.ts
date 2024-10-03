import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemeService } from '../services/theme.service';
import { HttpClient } from '@angular/common/http';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { ProfilComponent } from '../profil/profil.component';
import { CookieService } from 'ngx-cookie-service';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-fix-components',
  templateUrl: './fix-components.component.html',
  styleUrls: ['./fix-components.component.scss']
})
export class FixComponentsComponent implements OnInit {
  @ViewChildren('toggleGroup') toggleGroups!: QueryList<MatButtonToggleGroup>;
  selectedValue: string = 'bold';
  inputValue: string = '';
  isHandset: boolean = false;
  darkModeValue: any;
  preferences: any;
  NotifacationToggle!: boolean;
  darkModeToggle!: boolean;
  hourTimeToggle!: boolean;
  locationToggle!: boolean;
  temperatureValue!: string;
  windSpeedValue!: string;
  seaLevelValue!: string;
  humidityValue!: string;

  // Define the categories array with appropriate units
  categories = [
    { name: 'temperature', units: ['C', 'F'] },
    { name: 'windSpeed', units: ['Km/h', 'M/h'] },
    { name: 'seaLevel', units: ['hPa', 'mmHg','inHg'] },
    { name: 'humidity', units: ['%', 'g/m³'] }
  ];
  locationName: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private _snackBar: MatSnackBar,
    private themeService: ThemeService,
    private http: HttpClient,
    public dialog: MatDialog,
    private cookieService: CookieService,
    private locationService: LocationService
  ) {
    this.breakpointObserver.observe(Breakpoints.Handset).subscribe((result) => {
      this.isHandset = result.matches;
    });
  }

  ngOnInit(): void {
    this.loadPreferencesFromCookies();
    this.locationToggle = this.cookieService.get('location') === 'true';
    if (this.locationToggle) {
      this.getLocation();
    }

    this.darkModeToggle = this.themeService.getTheme();
  }

  
  // Track by function to optimize ngFor rendering
  trackByFn(index: number, item: any) {
    return item.name; // Using 'name' as the unique identifier
  }




onDarkModeToggleChange(newValue: boolean): void {
  this.darkModeToggle = newValue;
  this.themeService.setTheme(newValue);
}


  // Handle toggle change and save preference
  toggleChange(categoryName: string, selectedValue: any) {
    switch (categoryName) {
      case 'temperature':
        this.temperatureValue = selectedValue;
        this.cookieService.set('temperature', this.temperatureValue);
        break;
      case 'windSpeed':
        this.windSpeedValue = selectedValue;
        this.cookieService.set('windSpeed', this.windSpeedValue);
        break;
      case 'seaLevel':
        this.seaLevelValue = selectedValue;
        this.cookieService.set('seaLevel', this.seaLevelValue);
        break;
      case 'humidity':
        this.humidityValue = selectedValue;
        this.cookieService.set('humidity', this.humidityValue);
        break;
    }
  }

  // Show a message when a toggle is changed
  toggleChanged(event: any, toggleName: string) {
    const message = event.checked ? 'Activated' : 'Deactivated';
    this._snackBar.open(`${toggleName} ${message}`, 'Dismiss', {
      duration: 1000
    });
  }


  // Load user preferences from cookies
  loadPreferencesFromCookies() {
    this.temperatureValue = this.cookieService.get('temperature') || 'F';
    this.windSpeedValue = this.cookieService.get('windSpeed') || 'Km/h';
    this.seaLevelValue = this.cookieService.get('seaLevel') || 'm';
    this.humidityValue = this.cookieService.get('humidity') || '%';

    this.NotifacationToggle = this.cookieService.get('notification') === 'true';
    this.hourTimeToggle = this.cookieService.get('hourTime') === 'true';
    this.locationToggle = this.cookieService.get('location') === 'true';
    this.darkModeToggle = this.cookieService.get('darkMode') === 'true';

    // Optionally, load preferences from the backend and update cookies
    this.loadPreferencesFromDatabase();
  }

  // Fetch user preferences from the backend and update cookies
  loadPreferencesFromDatabase() {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.get('http://127.0.0.1:8000/weather/user/preferences', { headers })
      .subscribe(
        (response: any) => {
          this.preferences = response;
          this.darkModeToggle = this.preferences.darkMode;
          this.hourTimeToggle = this.preferences.hourTime;
          this.locationToggle = this.preferences.location;
          this.NotifacationToggle = this.preferences.notification;

          this.temperatureValue = this.preferences.temperature;
          this.windSpeedValue = this.preferences.windSpeed;
          this.seaLevelValue = this.preferences.seaLevel;
          this.humidityValue = this.preferences.humidity;

          // Save preferences to cookies
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 30);
          this.cookieService.set('temperature', this.temperatureValue, expirationDate);
          this.cookieService.set('windSpeed', this.windSpeedValue, expirationDate);
          this.cookieService.set('seaLevel', this.seaLevelValue, expirationDate);
          this.cookieService.set('humidity', this.humidityValue, expirationDate);
          this.cookieService.set('notification', String(this.NotifacationToggle), expirationDate);
          this.cookieService.set('hourTime', String(this.hourTimeToggle), expirationDate);
          this.cookieService.set('location', String(this.locationToggle), expirationDate);
          this.cookieService.set('darkMode', String(this.darkModeToggle), expirationDate);
        },
        (error) => {
          console.error('Error loading preferences', error);
        }
      );
  }

  // Save changes to user preferences in both backend and cookies
  saveChanges() {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    const data = {
      notification: this.NotifacationToggle,
      hourTime: this.hourTimeToggle,
      location: this.locationToggle,
      darkMode: this.darkModeToggle,
      temperature: this.temperatureValue,
      windSpeed: this.windSpeedValue,
      seaLevel: this.seaLevelValue,
      humidity: this.humidityValue
    };

    this.http.patch('http://127.0.0.1:8000/weather/update/user/preferences', data, { headers })
      .subscribe(
        (response) => {
          this._snackBar.open('Changes saved successfully', 'Dismiss', { duration: 2000 });

          // Update preferences in cookies as well
          this.cookieService.set('temperature', this.temperatureValue);
          this.cookieService.set('windSpeed', this.windSpeedValue);
          this.cookieService.set('seaLevel', this.seaLevelValue);
          this.cookieService.set('humidity', this.humidityValue);
          this.cookieService.set('notification', String(this.NotifacationToggle));
          this.cookieService.set('hourTime', String(this.hourTimeToggle));
          this.cookieService.set('location', String(this.locationToggle));
          this.cookieService.set('darkMode', String(this.darkModeToggle));
        },
        (error) => {
          console.error('Error updating preferences', error);
        }
      );
  }

  // Open dialog for user profile update
  openDialog() {
    const dialogRef = this.dialog.open(ProfilComponent, {
      width: '700px',
      height: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getLocation() {
    this.locationService.getUserLocation()
      .then(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Get location name (reverse geocoding)
        this.locationService.getLocationName(lat, lon)
          .subscribe((response: any) => {
            if (response && response.address) {
              // Extract the city name from the response
              const city = response.address.city || response.address.town || response.address.village;
              this.locationName = city ? city : 'City not found';
              console.log(this.locationName);
              localStorage.setItem('location', this.locationName);
            } else {
              console.log('No address in response:', response);
            }
          }, error => {
            console.log('Error in reverse geocoding:', error);
          });
      })
      .catch(error => {
        this.locationName = `Error: ${error.message}`;
        console.log(this.locationName);
      });
  }
}
