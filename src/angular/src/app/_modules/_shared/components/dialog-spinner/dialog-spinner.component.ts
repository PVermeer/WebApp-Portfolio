import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

// Requires a transparent css (panel)id in a parent stylesheet e.g.:
// #DialogSpinnerComponent {
//   box-shadow: none !important;
//   background: transparent !important;
// }

@Component({
  selector: 'app-do-not-use',
  template: `<mat-spinner></mat-spinner>`,
  styles: []
})
export class DialogSpinnerDialogComponent { }

@Component({
  selector: 'app-dialog-spinner',
  template: ``,
  styles: []
})
export class DialogSpinnerComponent implements OnInit, OnDestroy {

  private dialog: MatDialogRef<DialogSpinnerDialogComponent>;

  constructor(
    private matDialog: MatDialog,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.dialog = this.matDialog.open(DialogSpinnerDialogComponent, { id: 'DialogSpinnerComponent', disableClose: true });
    });
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.dialog.close();
    });
  }

}
