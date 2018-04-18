import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { MailService } from '../../_shared/mail.service';
import { SnackbarComponent } from '../../_shared/snackbar/snackbar.component';
import { DialogComponent, DialogContent } from '../../_shared/dialog/dialog.component';
import { ContactForm } from '../../../../../server/types/types';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css'],
})
export class ContactFormComponent {

  // Get elements
  @ViewChild('contactFormRef') private contactFormRef: NgForm;

  // Variables
  public contactForm: FormGroup;
  public name: string;
  public email: string;
  public subject: string;
  public message: string;
  public lname: string;
  public formInput: ContactForm;
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
  public sendForm(formInput: ContactForm) {
    this.progressBar = true;

    // Send the mail request
    this.mailService.sendContactForm(formInput).subscribe((response) => {
      this.progressBar = false;
      this.snackbarComponent.snackbarSuccess(response);

      // Open thanks dialog
      const data: DialogContent = {
        dialogData: {
          title: 'Success!',
          body: `Hey ${formInput.name}!<br><br> Thanks for the message.
          <br><br> I\'ll contact you soon via: <br><br><b>${formInput.email}</b>`,
          button: 'Cool!',
        }
      };
      const dialog = this.matDialog.open(DialogComponent, { data });

      // Reset the form after success
      dialog.afterClosed().subscribe(() => { this.contactFormRef.resetForm(); });

      // On error
    }, () => this.progressBar = false);
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
