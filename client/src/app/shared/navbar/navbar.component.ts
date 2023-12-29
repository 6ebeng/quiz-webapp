import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from 'src/app/users/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  authenticated : boolean = false;
  authSubscription : Subscription | null = null;
  user: User = new User();

  userSubject : BehaviorSubject<User> | null = null;
  userSubscription : Subscription | null = null;
  
  constructor(private authService: AuthService) {}

  ngOnInit(): void {

    this.authSubscription = this.authService.authStatus.subscribe(authenticated => {
      this.authenticated = authenticated;
    });

    this.authenticated = this.authService.isAuthenticated();

    this.userSubject = this.authService.getUser();
    this.userSubscription = this.userSubject.subscribe(user => {
      this.user = user;
    });
 }

 logout(){
   this.authService.logoutUser();
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
