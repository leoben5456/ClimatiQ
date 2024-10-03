import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { WeatherServiceService} from './services/weather-service.service';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, tap } from 'rxjs';
import { ThemeService } from './services/theme.service';

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
  constructor(private breakpointObserver: BreakpointObserver,private WeatherService:WeatherServiceService,private renderer: Renderer2, private themeService: ThemeService) {
    this.breakpointObserver.observe(Breakpoints.Handset).subscribe((result)=>{
      if(result.matches){
        this.isHandset = result.matches;
        this.isHandset=true
      }
      else
      this.isHandset=false
    })
  }
  ngOnInit(): void {
    this.cityControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.filteredCities = []),
        switchMap(value => this.WeatherService.getCities(value,5))
      )
      .subscribe((cities: any) => {
        this.filteredCities = cities.geonames;
      });

      this.themeService.theme$.subscribe((darkMode) => {
        this.isDarkMode = darkMode;
        this.toggleTheme(this.isDarkMode);
      });
  }


  toggleTheme(isDarkMode: boolean) {
    if (isDarkMode) {
      // Add the dark-theme class to the body
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      // Remove the dark-theme class from the body
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }

  onCitySelected(event: any) {
    console.log('Selected city:', event.option.value);
    this.selectedCity = event.option.value;
    this.WeatherService.setSelectedCity(event.option.value);
  }



  title = 'Weather';

  changeColor(event: Event) {
    // Remove the 'clicked' class from all elements
    const elements = document.querySelectorAll('.Menu div');
    elements.forEach((el) => {
      el.classList.remove('clicked');
    });

    // Add the 'clicked' class to the clicked element
    (event.currentTarget as HTMLElement).classList.add('clicked');
  }








}


