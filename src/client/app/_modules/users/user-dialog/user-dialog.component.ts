import { Component, OnInit } from '@angular/core';
import { DialogComponent } from '../../_shared/components/dialog/dialog.component';

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
  public registerIsDisabled = false;

  constructor(
    private dialogComponent: DialogComponent,
  ) { }

  ngOnInit() {
    // Check if the register tab must be disabled
    if (this.dialogComponent.data.registerDisable) {
      this.registerIsDisabled = true;
    }
  }

}
