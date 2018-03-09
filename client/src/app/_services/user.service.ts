import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../_models/user.model';
import { Observable } from 'rxjs/Observable';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  public getAll() {
    return this.http.get<User[]>('/users');
  }

  public getById(_id: string) {
    return this.http.get('/users/' + _id);
  }

  public checkUsername(username: string): Observable<any> {
    return this.http.get('/users/check?username=' + username, httpOptions);
  }

  }

  public create(user: User) {
    return this.http.post('/users/register', user);
  }

  public update(user: User) {
    return this.http.put('/users/' + user._id, user);
  }

  public delete(_id: string) {
    return this.http.delete('/users/' + _id);
  }
}
