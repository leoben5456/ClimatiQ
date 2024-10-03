import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { FixComponentsComponent } from './fix-components/fix-components.component';
import { HomeComponent } from './home/home.component';
import { CitiesComponent } from './cities/cities.component';
import { MapComponent } from './map/map.component';
import { AuthComponent } from './auth/auth.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AuthGuard } from './guards/auth.guard';
// app-routing.module.ts
import { WeatherResolverService } from './services/weather-resolver.service';
import { Oauth2CallbackComponent } from './oauth2-callback/oauth2-callback.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: '', component: MainLayoutComponent,canActivate: [AuthGuard], children: [
    { path: '', component: HomeComponent ,resolve: { weather: WeatherResolverService }},
    { path: 'Settings', component: FixComponentsComponent },
    { path: 'Cities', component: CitiesComponent },
    { path: 'Map', component: MapComponent },
    
  ]},
  { path: 'oauth2/callback', component: Oauth2CallbackComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
