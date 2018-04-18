import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { UserRegister, UserLogin } from './_models/user.model';
import { SnackbarComponent } from '../_shared/snackbar/snackbar.component';
import { DialogComponent } from '../_shared/dialog/dialog.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

interface UserType { rank: number; value: string; }

@Injectable()
export class UserService {

  // Variables
  private isLoggedInSource = new Subject<boolean>();
  private userTypeSource = new Subject<UserType>();

  public isLoggedIn$ = this.isLoggedInSource.asObservable();
  public userType$ = this.userTypeSource.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackbarComponent: SnackbarComponent,
    private matDialog: MatDialog,
  ) { }

  // Methods
  public login = (disableRegister?: boolean) => new Promise((resolve) => {

    // Check if register tab must be disabled
    let registerDisable = false;
    if (disableRegister) { registerDisable = true; }

    // Open dialog
    const component = UserDialogComponent;
    const loginDialog = this.matDialog.open(DialogComponent, { data: { component, registerDisable } });

    loginDialog.afterClosed().subscribe(loggedIn => {

      // Let the app know that login was successful
      if (loggedIn) { this.passLoginStatus(true); return resolve(true); }

      // Otherwise return a failed login
      this.passLoginStatus(false);
      return resolve(false);
    });
  })

  public logout() {
    localStorage.removeItem('currentUser');
    this.passLoginStatus(false);
    this.router.navigate(['/home']);
    this.snackbarComponent.snackbarSuccess('Logged out');
  }

  public checkLogin = () => new Promise((resolve) => {
    this.loginCheck().subscribe(() => {

      this.passLoginStatus(true);
      return resolve(true);

      // On error
    }, () => {
      this.passLoginStatus(false);
      return resolve(false);
    });
  })

  public passLoginStatus(isLoggedIn: boolean) { this.isLoggedInSource.next(isLoggedIn); }

  public passUserType() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) { return null; }

    const userType = currentUser.payload.type;
    this.userTypeSource.next(userType);
  }

  // Backend http requests
  public loginUser(loginForm: UserLogin): Observable<any> {
    return this.http.post<any>('/users/login', loginForm, httpOptions);
  }
  public loginCheck(): Observable<any> {
    return this.http.get('/users/logincheck', httpOptions);
  }
  public verifyEmail(token: string): Observable<any> {
    return this.http.get('/users/verify?token=' + token, httpOptions);
  }
  public getById(_id: string): Observable<any> {
    return this.http.get('/users/' + _id, httpOptions);
  }
  public checkUsername(username: string): Observable<any> {
    return this.http.get('/users/check?username=' + username, httpOptions);
  }
  public checkEmail(email: string): Observable<any> {
    return this.http.get('/users/check?email=' + email, httpOptions);
  }
  public registerUser(user: UserRegister): Observable<any> {
    return this.http.post('/users/register', user, httpOptions);
  }
  public userInfo(): Observable<any> {
    return this.http.get('/users/info', httpOptions);
  }
  public updateUser(user: UserRegister): Observable<any> {
    return this.http.put('/users/update', user, httpOptions);
  }
  public deleteUser(userId): Observable<any> {
    return this.http.delete('/users/delete/' + userId);
  }
  public recoverUserPassword(user: object): Observable<any> {
    return this.http.post('/users/recoverpassword', user, httpOptions);
  }
  public updateUserPassword(user: object, token: string): Observable<any> {
    return this.http.put('/users/updatepassword?token=' + token, user, httpOptions);
  }
  public UserMany(transactions): Observable<any> {
    return this.http.post('/users/many', transactions);
  }
  public deleteUserMany(id): Observable<any> {
    return this.http.delete('/users/deletemany/' + id);
  }
  public resetPasswordUserMany(id): Observable<any> {
    return this.http.post('/users/resetpasswordmany/' + id, '', httpOptions);
  }
  public getAllUsers(): Observable<any> {
    return this.http.get('/users/getall', httpOptions);
  }
  public createMockUser(user: UserRegister): Observable<any> {
    return this.http.post('/users/registermock', user, httpOptions);
  }

}
