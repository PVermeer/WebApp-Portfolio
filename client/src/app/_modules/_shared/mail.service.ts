import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ContactFormInput } from '../contact/contact.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class MailService {

  constructor(
    private http: HttpClient,
  ) { }

  public sendContactForm(contactForm: ContactFormInput): Observable<any> {
    return this.http.post('mail/contact-form', contactForm, httpOptions);
  }

}
