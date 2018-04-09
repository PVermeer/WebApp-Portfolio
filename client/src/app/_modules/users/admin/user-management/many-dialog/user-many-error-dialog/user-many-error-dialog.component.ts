import { Component } from '@angular/core';

import { DialogComponent } from '../../../../../_shared/dialog/dialog.component';

@Component({
  selector: 'app-user-many-error-dialog',
  templateUrl: './user-many-error-dialog.component.html',
  styleUrls: ['./user-many-error-dialog.component.css']
})
export class UserManyErrorDialogComponent {

  // Variables
  private response = this.dialogComponent.data.response;
  private selected = this.dialogComponent.data.selected;
  public title = 'There were some errors detected';
  public button = 'Ok';
  public report = [];
  public columnsToDisplay = ['email', 'error'];

  // Methods
  private errorReport() {
    this.response.forEach(x => {
      const key = Object.keys(x.response);

      if (key[0] === 'error') {
        const { id } = x;
        const user = this.selected.find((y) => y._id === id);

        const errorObject = { email: user.email, error: x.response.error };
        this.report.push(errorObject);
      }
    });
  }

  constructor(
    private dialogComponent: DialogComponent,
  ) {
    this.errorReport();
  }

}
