import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { UserRegister, UserLogin } from '../_models/user.model';
import { SnackbarComponent } from '../_components/snackbar/snackbar.component';
import { UserDialogComponent } from '../_components/user-dialog/user-dialog.component';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserService {

  // Variables
  private isLoggedInSource = new Subject<boolean>();
  private userTypeSource = new Subject<string>();

  public isLoggedIn$ = this.isLoggedInSource.asObservable();
  public userType$ = this.userTypeSource.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackbarComponent: SnackbarComponent,
    private matDialog: MatDialog,
  ) { }

  // Methods
  public login = () => new Promise((resolve) => {
    const loginDialog = this.matDialog.open(UserDialogComponent);
    loginDialog.afterClosed().subscribe(loggedIn => {
      if (loggedIn) {
        this.passLoginStatus(true);
        return resolve(true);
      }
      this.passLoginStatus(false); return resolve(false);
    });
  })

  public logout() {
    localStorage.removeItem('currentUser');
    this.passLoginStatus(false);
    this.router.navigate(['/home']);
    this.snackbarComponent.snackbarSucces('Logged out');
  }

  public checkLogin = () => new Promise((resolve) => {
    this.loginCheck().subscribe(response => {
      if (response.error) {
        this.passLoginStatus(false);
        return resolve(false);
      }
      this.passLoginStatus(true);
      return resolve(true);
    });
  })

  public passLoginStatus(isLoggedIn: boolean) {
    this.isLoggedInSource.next(isLoggedIn);
  }

  public passUserType() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) { return null; }

    const userType = currentUser.payload.type;

    this.userTypeSource.next(userType);
  }

  // Backend
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
  public deleteUserMany(deleteId): Observable<any> {
    return this.http.delete('/users/deletemany/' + deleteId);
  }
  public getAllUsers(): Observable<any> {
    return this.http.get('/users/getall', httpOptions);
  }
  public createMockUser(user: UserRegister): Observable<any> {
    return this.http.post('/users/registermock', user, httpOptions);
  }

}
