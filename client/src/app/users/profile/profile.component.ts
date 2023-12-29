import { Component } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from '../user.model';
import { AuthService } from 'src/app/shared/auth.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from 'src/app/shared/validator.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  authenticated : boolean = false;
  authSubscription : Subscription | null = null;
  user: User = new User();

  userSubject : BehaviorSubject<User> | null = null;
  userSubscription : Subscription | null = null;

  profileForm! : FormGroup;
  edit: boolean = false;
  
  constructor(private authService: AuthService, private fb : FormBuilder, private validatorService: ValidatorService) {}

  ngOnInit(): void {

    this.authSubscription = this.authService.authStatus.subscribe(authenticated => {
      this.authenticated = authenticated;
    });

    this.authenticated = this.authService.isAuthenticated();

    this.userSubject = this.authService.getUser();
    this.userSubscription = this.userSubject.subscribe(user => {
      this.user = user;
    });

    this.profileForm = this.fb.group({
      'username' : new FormControl({value: this.user.username, disabled: true}, null),
      'name' : new FormControl(this.user.name, null),
      'surname' : new FormControl(this.user.surname, null),
      'age' : new FormControl(this.user.age, null),
      'email': new FormControl(this.user.email, [Validators.required, Validators.email])
    });
 }

 getErrorMessages(control: AbstractControl, patterns?: string[]): string[] {

  return this.validatorService.generateErrorMsgs(control, patterns);
}

 onEdit() {
 
  if (this.edit) {

    let user : User = {...this.profileForm.value, id: this.user.id, username: this.user.username, password: this.user.password, avatarURL: this.user.avatarURL};   
    this.authService.editUser(user); 
  }
  
  this.edit = !this.edit;
 }


 ngOnDestroy(){

  if (this.authSubscription) {
    this.authSubscription.unsubscribe();
  }

  if (this.userSubscription) {
    this.userSubscription.unsubscribe();
  }
 }

}
