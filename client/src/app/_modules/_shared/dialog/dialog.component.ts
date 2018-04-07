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
  public isComponent = false;
  private dialogPosition: DialogPosition = { top: '160px' };

  constructor(
    public matDialog: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (data.dialogData) {
      this.title = data.dialogData.title;
      this.body = data.dialogData.body;
      this.button = data.dialogData.button;
    }
    if (data.component) {
      this.isComponent = true;
    }
  }

  ngOnInit() {
    // Dialog options
    this.matDialog.updatePosition(this.dialogPosition);
  }

}
