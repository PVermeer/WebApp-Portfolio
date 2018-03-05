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
  private succesMsg = 'Bedankt voor je bericht. Ik zal spoedig contact met je opnemen via:';
  private errorMsg = 'Oeps... er is iets fout gegaan... Je kunt contact opnemen via:';
  private errorMail = 'Some email or link'; // This is send to the client so watchout for spam.

  constructor(
    private dialogRef: MatDialogRef<ContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.status === 'succes') {
      this.title = data.status;
      this.name = 'Beste ' + data.name + ',';
      this.body = this.succesMsg;
      this.email = data.email;
      this.button = 'Cool!';
      return;
    }
    if (data.status === 'failure') {
      this.title = data.status;
      this.name = 'Beste ' + data.name + ',';
      this.body = this.errorMsg;
      this.email = this.errorMail;
      this.button = 'Ok...';
      return;
    }
    this.title = data.statusText;
    this.name = data.status;
    this.body = this.errorMsg;
    this.email = this.errorMail;
    this.button = 'Ok...';
  }

  close(): void {
    this.dialogRef.close();
  }

}
