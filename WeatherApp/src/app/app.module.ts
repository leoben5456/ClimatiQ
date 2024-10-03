import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FixComponentsComponent } from './fix-components/fix-components.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CitiesComponent } from './cities/cities.component';
import { MapComponent } from './map/map.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { AuthComponent } from './auth/auth.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ProfilComponent } from './profil/profil.component';
import { LoadingComponent } from './loading/loading.component';
import { TemperaturePipe } from './pipes/temperature.pipe';
import { CookieService } from 'ngx-cookie-service';
import { WindSpeedPipe } from './pipes/wind-speed.pipe';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { TimePipe } from './pipes/time.pipe';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { HumidityPipe } from './pipes/humidity.pipe';
import { SeaLevelPipe } from './pipes/sea-level.pipe';
import { Oauth2CallbackComponent } from './oauth2-callback/oauth2-callback.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FixComponentsComponent,
    CitiesComponent,
    MapComponent,
    AuthComponent,
    MainLayoutComponent,
    ProfilComponent,
    LoadingComponent,
    TemperaturePipe,
    WindSpeedPipe,
    TimePipe,
    HumidityPipe,
    SeaLevelPipe,
    Oauth2CallbackComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatDividerModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatInputModule,
    MatDialogModule,
    MatSidenavModule,
    ConfirmDialogModule

  ],
  providers: [
    ConfirmationService,
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
