import { Component } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Component({
  selector: 'app-snackbar',
  template: '',
  styleUrls: ['./snackbar.component.css']
})
export class SnackbarComponent {

  // Config
  private configSuccess: MatSnackBarConfig = {
    politeness: null,
    announcementMessage: null,
    viewContainerRef: null,
    duration: 3000,
    panelClass: ['style-succes'],
    direction: null,
    data: null,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  };

  private configError: MatSnackBarConfig = {
    politeness: null,
    announcementMessage: null,
    viewContainerRef: null,
    duration: 3000,
    panelClass: ['style-error'],
    direction: null,
    data: null,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  };

  // Methods
  public snackbarSuccess(message) {
    this.snackBar.open(message, 'CLOSE', this.configSuccess);
  }

  public snackbarError(message) {
    this.snackBar.open(message, 'CLOSE', this.configError);
  }

  constructor(
    private snackBar: MatSnackBar,
  ) { }

}
