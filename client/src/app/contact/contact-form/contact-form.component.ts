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

  // Custom alerts
  public nameAlert = 'Vul dit veld in';
  public emailAlert = 'Geen geldig e-mail adres';
  public subjectAlert = 'Minmaal 3 en maximaal 50 karakters';
  public messageAlert = 'Minmaal 3 en maximaal 1000 karakters';
  public lnameAlert = '';

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
    this.contactForm = formBuilder.group({
      name: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      subject: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      message: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(1000)])],
      lname: [null, Validators.compose([Validators.maxLength(0)])],
    });
  }

}
