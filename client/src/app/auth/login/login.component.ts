import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/auth.service';
import { ValidatorService } from 'src/app/shared/validator.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  authSubscription : Subscription | null = null;
  authenticated : boolean = false;

  formInvalid : boolean = false;
  loginForm!: FormGroup;
  message : string = '';

  constructor(private authService : AuthService, private router : Router, private fb : FormBuilder, private validatorService: ValidatorService) {}

  ngOnInit() {

    this.loginForm = this.fb.group({
      'username' : new FormControl("", Validators.required),
      'password' : new FormControl("", Validators.required)},
      { 
        validators: [this.validatorService.globalValidator()]
      }
    );

    this.authService.msgEmitter.subscribe((msg : string) => {
      this.message = msg;
    });

    this.authSubscription = this.authService.authStatus.subscribe(authenticated => {
      this.authenticated = authenticated;
    });

    this.authenticated = this.authService.isAuthenticated();

    if (this.authenticated) {
      this.router.navigate(['/']);
    }
  }

  onLogin() {

    if (this.loginForm.valid) {
      this.formInvalid = false;
      this.authService.loginUser(this.loginForm.value.username, this.loginForm.value.password);
    }
    else {
      this.formInvalid = true;
    }

  }

  ngOnDestroy() {

    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

}
