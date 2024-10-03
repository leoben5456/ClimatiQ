import { Component, OnInit } from '@angular/core';
import { WeatherServiceService } from '../services/weather-service.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ThemeService } from '../services/theme.service';
@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit{

  firstName!: string ;
  lastName!: string ;
  email!: string ;
  username!: string ;
  location!: string ;
  password!: string ;
  isDarkMode!: boolean;

  constructor(private weatherService: WeatherServiceService,private http:HttpClient,public dialogRef:MatDialogRef<ProfilComponent>,private themeService:ThemeService) { }
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.weatherService.getUserInfo(token).subscribe((data) => {
      console.log(data);
      this.firstName = data.first_name;
      this.lastName = data.last_name;
      this.email = data.email;
      this.username = data.username;
      this.location = data.location;
    });

    this.themeService.theme$.subscribe((darkMode) => {
      this.isDarkMode = darkMode;
      console.log('Dark mode:', darkMode);
      
    });
  }



//Function to save user uptaded information
saveinfo() {
  const body = {
    first_name: this.firstName,
    last_name: this.lastName,
    email: this.email,
    username: this.username,
    location: this.location,
    password: this.password,
  };

  this.http.patch(`http://127.0.0.1:8000/weather/update/user/info/`, body)
    .subscribe({
      next: (response) => {
        console.log("Response: ", response);
      },
      error: (error) => {
        console.error("Error: ", error);
      }
    });

  this.dialogRef.close();

}


}
