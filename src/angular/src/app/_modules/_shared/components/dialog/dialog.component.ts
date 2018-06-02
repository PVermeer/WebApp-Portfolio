import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { MatDialogRef, DialogPosition, MAT_DIALOG_DATA } from '@angular/material';
import { ComponentType } from '@angular/cdk/portal';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styles: ['']
})
export class DialogComponent implements OnInit {

  // Variables
  public title: string;
  public body: string;
  public button: string;
  public button2: string | false;
  public component: ComponentType<any> | TemplateRef<any>;
  public isComponent = false;
  private dialogPosition: DialogPosition = { top: '100px' };

  constructor(
    public matDialog: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogContent,
  ) {
    if (data.dialogData) {
      this.title = data.dialogData.title;
      this.body = data.dialogData.body;
      this.button = data.dialogData.button;
      this.button2 = data.dialogData.button2 || false;
    }
    if (data.component) {
      this.component = data.component;
      this.isComponent = true;
    }
  }

  public closeDialog(success: boolean) {
    if (success) { return this.matDialog.close(true); }
    this.matDialog.close(false);
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
  button2?: string;
}
/**
* Dialog interface. Use dialogData or component to open a custom dialog.
* @property {DialogData} dialogData Object with properties: title, body(can be HTML) and button / button2? as strings.
* @property {angularComponent} component An angular component to be loaded in a dialog.
*/
export interface DialogContent {
  dialogData?: DialogData;
  component?: ComponentType<any> | TemplateRef<any>;
  [key: string]: any;
}
