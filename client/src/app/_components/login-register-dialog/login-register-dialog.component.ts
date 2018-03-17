import { Component, OnInit } from '@angular/core';
import { MatDialogRef, DialogPosition } from '@angular/material';

@Component({
  selector: 'app-login-register-dialog',
  templateUrl: './login-register-dialog.component.html',
  styleUrls: ['./login-register-dialog.component.css'],
})
export class LoginRegisterDialogComponent implements OnInit {

  // Variables
  public title = 'Login';
  public tabPage = 0;
  public progressBar = false;
  private dialogPosition: DialogPosition = { top: '25%' };

  constructor(
    public matDialog: MatDialogRef<LoginRegisterDialogComponent>,
  ) { }

  ngOnInit() {
    // Dialog options
    this.matDialog.updatePosition(this.dialogPosition);
  }

}
