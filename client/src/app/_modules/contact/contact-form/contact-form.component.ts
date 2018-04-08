import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { ContactFormInput } from '../contact.model';
import { MailService } from '../../_shared/mail.service';
import { SnackbarComponent } from '../../_shared/snackbar/snackbar.component';
import { DialogComponent } from '../../_shared/dialog/dialog.component';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css'],
})
export class ContactFormComponent {

  @ViewChild('contactFormRef') private contactFormRef;

  // Variables
  public contactForm: FormGroup;
  public name: string;
  public email: string;
  public subject: string;
  public message: string;
  public lname: string;
  public formInput: ContactFormInput;
  public progressBar = false;

  // Contact form fields
  public contactFormInputfields = [
    {
      placeholder: 'Name',
      formControlName: 'name',
      type: 'text',
      alert: '3 - 50 Characters, pretty please.',
      asyncAlert: '',
    }, {
      placeholder: 'E-mail',
      formControlName: 'email',
      type: 'text',
      alert: 'Not a valid e-mail address',
      asyncAlert: '',
    }, {
      placeholder: 'Subject',
      formControlName: 'subject',
      type: 'text',
      alert: '3 - 50 Characters, pretty please.',
      asyncAlert: '',
    },
  ];
  public contactFormTextfields = [
    {
      placeholder: 'Message',
      formControlName: 'message',
      type: 'text',
      alert: 'Required',
      asyncAlert: '',
    }
  ];

  // Methods
  public sendForm(formInput) {
    this.progressBar = true;
    const dialogData = {
      title: 'Success!',
      body: `Hey ${formInput.name}!<br><br> Thanks for the message.<br><br> I\'ll contact you soon via: <br><br><b>${formInput.email}</b>`,
      button: 'Cool!',
    };

    this.mailService.sendContactForm(formInput).subscribe((response) => {
      this.progressBar = false;

      this.snackbarComponent.snackbarSucces(response.success);

      const dialog = this.matDialog.open(DialogComponent, { data: { dialogData } });

      dialog.afterClosed().subscribe(() => {
        this.contactFormRef.resetForm();
      });

    }, () => { this.progressBar = false; }
  );
  }

  constructor(
    private formBuilder: FormBuilder,
    private mailService: MailService,
    public matDialog: MatDialog,
    private snackbarComponent: SnackbarComponent,
  ) {
    // Form validation
    this.contactForm = this.validateContactForm();
  }

  // -----------------Constructor methods------------------------

  // Validations
  private validateContactForm() {
    return this.formBuilder.group({
      name: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      subject: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      message: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(1000)])],
      lname: [null, Validators.compose([Validators.maxLength(0)])],
    });
  }

}
