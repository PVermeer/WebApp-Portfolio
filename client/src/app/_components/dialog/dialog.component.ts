import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, DialogPosition, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  // Variables
  public title: string;
  public body: string;
  public button: string;
  private dialogPosition: DialogPosition = { top: '160px' };

  constructor(
    public matDialog: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.title = data.title;
    this.body = data.body;
    this.button = data.button;
   }

  ngOnInit() {
    // Dialog options
    this.matDialog.updatePosition(this.dialogPosition);
  }

}
