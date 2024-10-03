import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  loading: boolean = false;
  matcher = new MyErrorStateMatcher();
  usernameFormControl = new FormControl('', [
    Validators.required,

  ]);
  
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);

  loginForm = new FormGroup({
    username: this.usernameFormControl,
    password: this.passwordFormControl
  });
constructor(private http: HttpClient,private router: Router,private authService: AuthService,) { }
onSubmit() {
  this.authService.login(this.loginForm.value).subscribe(
    (response) => {
      this.loading = true;
      this.router.navigate(['']);
    },
    (error) => {
      console.error(error);
    }
  );
}
}


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

