import { Component } from '@angular/core';

import { DialogComponent } from '../../../../../_shared/dialog/dialog.component';

@Component({
  selector: 'app-user-many-error-dialog',
  templateUrl: './user-many-error-dialog.component.html',
  styleUrls: ['./user-many-error-dialog.component.css']
})
export class UserManyErrorDialogComponent {

  // Variables
  private response = this.dialogComponent.data.error;
  private selected = this.dialogComponent.data.selected;
  public title = 'Errors detected';
  public body = this.dialogComponent.data.error.message;
  public button = 'Ok';
  public buildTable = false;
  public report: { email: string; error: any; }[] = [];
  public columnsToDisplay = ['email', 'error'];

  // Methods
  private errorReport(): void {

    if (this.response.result) {
      this.buildTable = true;

    // Construct a table
      this.response.result.forEach((x: { id: string, error: string }) => {
        const keys = Object.keys(x);
        const isError = keys.some(key => key === 'error');

        if (isError) {
          const { id } = x;
          const user = this.selected.find((y: { _id: string }) => y._id === id);

          const errorObject = { email: user.email, error: x.error };
          this.report.push(errorObject);
        }
      });
    }
  }

  constructor(
    private dialogComponent: DialogComponent,
  ) {
    // Run error report
    this.errorReport();
  }

}
