import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ContactForm } from '../../../../../server/routes/mail/mail.types';
import { DialogComponent, DialogContent } from '../../_shared/components/dialog/dialog.component';
import { SnackbarComponent } from '../../_shared/components/snackbar/snackbar.component';
import { MailService } from '../../_shared/services/mail.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styles: [''],
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
    this.mailService.sendContactForm(formInput).subscribe((response: string) => {
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
    }, (error) => {
      this.progressBar = false;

      // Open dialog with contact details
      const data: DialogContent = {
        dialogData: {
          title: 'Whoops something went wrong',
          body: error.message,
          button: 'Okay...',
        }
      };
      this.matDialog.open(DialogComponent, { data });
    });
  }

  private validateContactForm() {
    return this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: [null, [Validators.required, Validators.email]],
      subject: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      message: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
      lname: [null, [Validators.maxLength(0)]],
    });
  }

  // Lifecycle
  constructor(
    private formBuilder: FormBuilder,
    private mailService: MailService,
    public matDialog: MatDialog,
    private snackbarComponent: SnackbarComponent,
  ) {
    // Form validation
    this.contactForm = this.validateContactForm();
  }

}
