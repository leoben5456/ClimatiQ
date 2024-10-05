import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { WeatherServiceService } from './services/weather-service.service';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, tap } from 'rxjs';
import { ThemeService } from './services/theme.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';  // Import Router
import { LoadingService } from './services/loading.service';  // Import LoadingService

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  inputValue: string = '';
  isHandset: boolean = false;
  isFixed = false;
  cityControl = new FormControl();
  filteredCities: any[] = [];
  selectedCity: string = '';
  isDarkMode: boolean = false;
  isLoading = false; // New: Add loading flag

  constructor(
    private breakpointObserver: BreakpointObserver,
    private WeatherService: WeatherServiceService,
    private renderer: Renderer2,
    private themeService: ThemeService,
    private router: Router,  // Add Router
    private loadingService: LoadingService  // Add LoadingService
  ) {
    // Observe handset breakpoint
    this.breakpointObserver.observe(Breakpoints.Handset).subscribe((result) => {
      this.isHandset = result.matches;
    });
  }

  ngOnInit(): void {
    // Subscribe to value changes on city control
    this.cityControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.filteredCities = [])),
        switchMap((value) => this.WeatherService.getCities(value, 5))
      )
      .subscribe((cities: any) => {
        this.filteredCities = cities.geonames;
      });

    // Subscribe to theme changes
    this.themeService.theme$.subscribe((darkMode) => {
      this.isDarkMode = darkMode;
      this.toggleTheme(this.isDarkMode);
    });

    // Listen to router events and toggle loading animation
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loadingService.showLoading();  // Show loading animation when navigation starts
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loadingService.hideLoading();  // Hide loading animation when navigation ends or fails
      }
    });

    // Subscribe to loading state changes
    this.loadingService.isLoading$.subscribe((isLoading) => {
      this.isLoading = isLoading;  // Update the loading flag
    });
  }

  // Toggle the theme based on dark mode
  toggleTheme(isDarkMode: boolean) {
    if (isDarkMode) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }

  // Handle city selection
  onCitySelected(event: any) {
    console.log('Selected city:', event.option.value);
    this.selectedCity = event.option.value;
    this.WeatherService.setSelectedCity(event.option.value);
  }

  // Handle color change in the menu
  changeColor(event: Event) {
    const elements = document.querySelectorAll('.Menu div');
    elements.forEach((el) => {
      el.classList.remove('clicked');
    });
    (event.currentTarget as HTMLElement).classList.add('clicked');
  }

  title = 'Weather';
}
