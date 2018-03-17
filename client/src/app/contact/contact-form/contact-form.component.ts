import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';
import { ContactFormInput } from '../../_models/backend';
import { BackendService } from '../../_services/backend.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css'],
  providers: [BackendService],
})
export class ContactFormComponent {

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

  // Post form to back-end
  private postForm(formInput) {
    this.progressBar = true;
    this.postBackendService.postRequest(formInput).subscribe(
      (res) => {
        this.progressBar = false;
        const dialog = this.matDialog.open(ContactDialogComponent, {
          data: res
        });
      },
      (error) => {
        this.progressBar = false;
        const dialog = this.matDialog.open(ContactDialogComponent, {
          data: error
        });
      }
    );
  }

  constructor(
    private formBuilder: FormBuilder,
    private postBackendService: BackendService,
    public matDialog: MatDialog,
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
