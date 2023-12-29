import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, filter, map } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { ValidatorService } from 'src/app/shared/validator.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  authSubscription : Subscription | null = null;
  authenticated : boolean = false;

  registerForm!: FormGroup;
  message : string = '';

  constructor(private authService: AuthService,  private router : Router, private fb : FormBuilder, private validatorService: ValidatorService) {}

  ngOnInit(): void {

  let pattern = /^(?=.*\d)(?=.*[@_!#$%^&*()\-+={}[\]:;<>,.?~\\/])/;

    this.registerForm = this.fb.group({
      'username': new FormControl("", [Validators.required, Validators.minLength(3)]),
      'password': new FormControl("", [Validators.required, Validators.minLength(8), Validators.pattern(pattern)]),
      'repeatedPassword': new FormControl("", [Validators.required, Validators.minLength(8), Validators.pattern(pattern)]),
      'email': new FormControl("", [Validators.required, Validators.email])},
      {
        validators: [this.validatorService.matchValidator('password', 'repeatedPassword')]
      }
    )

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

  getErrorMessages(control: AbstractControl, patterns?: string[]): string[] {

    return this.validatorService.generateErrorMsgs(control, patterns);
  }

  onRegister(){

    const {repeatedPassword, ...user} = this.registerForm.value;
    this.authService.registerUser(user);

  }

  ngOnDestroy() {

    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }

  }

}
