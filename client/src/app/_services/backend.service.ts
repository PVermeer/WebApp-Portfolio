import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ContactFormInput } from '../_models/backend';
import { Observable } from 'rxjs/Observable';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class BackendService {

  constructor(
    private http: HttpClient,
  ) { }

  public postRequest(body: ContactFormInput): Observable<any> {
    return this.http.post('mail/contact-form', body, httpOptions);
  }

}
