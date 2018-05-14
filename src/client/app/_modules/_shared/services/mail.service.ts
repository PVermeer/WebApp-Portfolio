import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ContactForm } from '../../../../../server/routes/mail/mail.types';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class MailService {

  constructor(
    private http: HttpClient,
  ) { }

  public sendContactForm(contactForm: ContactForm): Observable<any> {
    return this.http.post('mail/contact-form', contactForm, httpOptions);
  }

}
