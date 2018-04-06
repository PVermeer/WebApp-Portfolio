import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.css']
})
export class ContactDialogComponent {

  // Template
  public title: string;
  public name: string;
  public body: string;
  public email: string;
  public button: string;

  // Custom messages
  private succesMsg = 'Thanks for the message. I\'ll contact you soon via:';
  private errorMsg = 'Oops... something went wrong... You can contact me via:';
  private errorMail = 'Some email or link'; // This is send to the client so watch out for spam.

  constructor(
    private dialogRef: MatDialogRef<ContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.res.success) {
      this.title = 'Succes!';
      this.name = 'Yoww ' + data.formInput.name + ',';
      this.body = this.succesMsg;
      this.email = data.formInput.email;
      this.button = 'Cool!';
      return;
    }
    if (data.res.error) {
      this.title = 'Something went wrong :(';
      this.name = 'Yoww ' + data.formInput.name + ',';
      this.body = this.errorMsg;
      this.email = this.errorMail;
      this.button = 'Ok...';
      return;
    }
    this.title = data.statusText;
    this.name = data.formInput.status;
    this.body = this.errorMsg;
    this.email = this.errorMail;
    this.button = 'Ok...';
  }

  close(): void {
    this.dialogRef.close();
  }

}
