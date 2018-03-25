import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ContactFormInput } from '../_models/mail';
import { Observable } from 'rxjs/Observable';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class MailService {

  constructor(
    private http: HttpClient,
  ) { }

  public postRequest(contactForm: ContactFormInput): Observable<any> {
    return this.http.post('mail/contact-form', contactForm, httpOptions);
  }

}
