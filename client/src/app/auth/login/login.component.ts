import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { ValidatorService } from 'src/app/shared/validator.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  // authSubscription : Subscription | null = null;
  // private authenticated : boolean = false;


  loginForm!: FormGroup;
  // formInvalid : boolean = false;
  message : string = '';

  constructor(private authService : AuthService, private fb : FormBuilder, private validatorService: ValidatorService) {}

  ngOnInit() {

    this.loginForm = this.fb.group({
      'username' : new FormControl("", Validators.required),
      'password' : new FormControl("", Validators.required)}
    );

    this.authService.msgEmitter.subscribe((msg : string) => {
      this.message = msg;
    });

    // this.authSubscription = this.authService.authStatus.subscribe(authenticated => {
    //   this.authenticated = authenticated;
    // });

    // this.authenticated = this.authService.isAuthenticated();


    // if (this.authenticated) {

    //     this.router.navigate(['/']);
    // }

  }

  onLogin() {

    if (this.loginForm.valid) {
      // this.formInvalid = false;
      this.authService.loginUser({username: this.loginForm.value.username, password: this.loginForm.value.password});
    }
    // else {
    //   this.formInvalid = true;
    // }

  }

  getErrorMessages(control: AbstractControl, patterns?: string[]): string[] {

    return this.validatorService.generateErrorMsgs(control, patterns);
  }


  ngOnDestroy() {

    // if (this.authSubscription) {
    //   this.authSubscription.unsubscribe();
    // }
  }

}
