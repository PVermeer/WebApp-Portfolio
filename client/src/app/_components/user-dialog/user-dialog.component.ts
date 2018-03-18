import { Component, OnInit } from '@angular/core';
import { MatDialogRef, DialogPosition } from '@angular/material';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css'],
})
export class UserDialogComponent implements OnInit {

  // Variables
  public title = 'Login';
  public tabPage = 0;
  public progressBar = false;
  private dialogPosition: DialogPosition = { top: '25%' };

  constructor(
    public matDialog: MatDialogRef<UserDialogComponent>,
  ) { }

  ngOnInit() {
    // Dialog options
    this.matDialog.updatePosition(this.dialogPosition);
  }

}
