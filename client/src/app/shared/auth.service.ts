import { Injectable } from '@angular/core';
import { User } from '../users/user.model';
import { BehaviorSubject, Subject, catchError, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { UserRole } from '../users/user-role.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user : User | null = null;
  userSubject : BehaviorSubject<User> = new BehaviorSubject<User>(new User());

  msgEmitter : Subject<string> = new Subject<string>();
  authStatus : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private router: Router, private dataService: DataService) {}

  loginUser(username: string, password: string) {

    this.dataService.getUser(username, password).subscribe({
      next: (user : User | undefined) => {
          if (user) {
            // this.user = {...user, password: '***'};
            this.user = user;
            this.userSubject.next({...this.user});

            sessionStorage.setItem('user', JSON.stringify(this.user));
            this.authStatus.next(true);
            if (this.user.role === UserRole.User) {
              this.router.navigate(['/']);
            }
            else if (this.user.role === UserRole.Admin) {
              this.router.navigate(['/admin']);
            }
          } else {
            this.msgEmitter.next('Invalid credentials');
          }
        },
        error: (error) => {
          console.error(error);
      }});
  }

  logoutUser() {
    this.user = null;
    sessionStorage.removeItem('user');
    this.authStatus.next(false);
    this.router.navigate(['/auth/login']);
  }

  registerUser(user: User) {

    this.dataService.isRegisteredUsername(user.username).pipe(
      switchMap((registered) => {
        if (!registered) {
          return this.dataService.addUser(user);
        } else {
          this.msgEmitter.next('Username already exists.');
          return of(null); 
        }
      }),
      catchError((error) => {
        console.error(error);
        return of(null); 
      })
    ).subscribe({
      next: (res) => {
        if (res) {
          this.user = user;
          sessionStorage.setItem('user', JSON.stringify(this.user));
          this.authStatus.next(true);
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.log(error);
      }});
  }

  editUser(user: User) {
    
    this.dataService.editUser(user).subscribe({
      next: (res) => {
        this.user = user;
        this.userSubject.next({...this.user});
      },
      error: (error) => {
        console.log(error);
      }});
   }

  isAuthenticated(){
    this.restoreUserFromStorage();
     return this.user != null;
  }

  getUser() {
    this.restoreUserFromStorage();
    return this.userSubject;
  }

  restoreUserFromStorage() {
    
    let user = sessionStorage.getItem('user');

    if (user && !this.user) {
      this.user = JSON.parse(user);
      this.userSubject.next({...this.user as User});
    }
  }
}
