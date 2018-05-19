import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DialogComponent } from '../../../_shared/components/dialog/dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: []
})
export class NewPageComponent {

  public pageTitle: string;

  public create() {
    this.matDialogRef.close(this.pageTitle);
  }

  constructor(
    private matDialogRef: MatDialogRef<DialogComponent>,
  ) { }

}
