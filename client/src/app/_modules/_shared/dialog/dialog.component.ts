import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { MatDialogRef, DialogPosition, MAT_DIALOG_DATA } from '@angular/material';
import { ComponentType } from '@angular/cdk/portal';

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
  public component: ComponentType<any> | TemplateRef<any>;
  public isComponent = false;
  private dialogPosition: DialogPosition = { top: '160px' };
  public progressBar = false;

  constructor(
    public matDialog: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogContent,
  ) {
    if (data.dialogData) {
      this.title = data.dialogData.title;
      this.body = data.dialogData.body;
      this.button = data.dialogData.button;
    }
    if (data.component) {
      this.component = data.component;
      this.isComponent = true;
    }
  }

  ngOnInit() {
    // Dialog options
    this.matDialog.updatePosition(this.dialogPosition);
  }

}

/**
* Basic dialog template. Body can be HTML format.
*/
interface DialogData {
  title: string;
  body: string;
  button: string;
}
/**
* Dialog interface.
*/
export interface DialogContent {
  dialogData?: DialogData;
  component?: ComponentType<any> | TemplateRef<any>;
  [key: string]: any;
}
