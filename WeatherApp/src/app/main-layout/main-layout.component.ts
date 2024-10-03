import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, tap } from 'rxjs';
import { WeatherServiceService } from '../services/weather-service.service';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { ThemeService } from '../services/theme.service';
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  @ViewChild('mobileSidenav') mobileSidenav!: MatSidenav;
  inputValue: string = '';
  isHandset: boolean = false;
  isFixed = false;
  cityControl = new FormControl();
  filteredCities: any[] = [];
  selectedCity: string = '';
  currentRoute: string = '';
  title = 'Weather';
  isLoggedIn$ = this.authService.isAuthenticated;
  isDarkMode!: boolean;
  constructor(private breakpointObserver: BreakpointObserver,private WeatherService:WeatherServiceService,private router: Router,private authService: AuthService,private cookieService:CookieService,private confirmationService: ConfirmationService,private http:HttpClient,private themeService: ThemeService) {
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
    this.themeService.theme$.subscribe((darkMode) => {
      this.isDarkMode = darkMode;
      console.log('Dark mode:', darkMode);
      
    });
    
    this.cityControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.filteredCities = []),
        switchMap(value => this.WeatherService.getCities(value,5))
      )
      .subscribe((cities: any) => {
        this.filteredCities = cities.geonames;
      });

       this.currentRoute = this.router.url;
  }

onCitySelected(event: any) {
  console.log('Selected city:', event.option.value);
  this.selectedCity = event.option.value;
  const currentRoute = this.router.url;
  if(currentRoute === '/'){
    this.WeatherService.setSelectedCity(event.option.value);
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 90);
    this.cookieService.set('city',event.option.value,expirationDate);
    this.updateCity(event.option.value);
  }



  else if (currentRoute === '/Cities') {

    this.WeatherService.addCity(event.option.value).subscribe({
      next: () => {
        console.log('City added successfully:', event.option.value);
      },
      error: (err) => {
        console.error('Error adding city:', err);
      }
    });
  }

}



updateCity(city:string){
   const body={City:city};

   this.http.patch(`http://127.0.0.1:8000/weather/update/user/info/`, body).subscribe({
    next: (response) => {
      console.log("Response: ", response);
    },
    error: (error) => {
      console.error("Error: ", error);  
    }
   });
}

  changeColor(event: Event) {
    // Remove the 'clicked' class from all elements
    const elements = document.querySelectorAll('.Menu div');
    elements.forEach((el) => {
      el.classList.remove('clicked');
    });

    // Add the 'clicked' class to the clicked element
    (event.currentTarget as HTMLElement).classList.add('clicked');

}

onLogout() {
  this.authService.logout();
}


confirm1(event: Event) {
  this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.onLogout();
      },
      reject: () => {
      }
  });
}





}
