import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { DialogComponent } from '../../../_shared/dialog/dialog.component';
import { PasswordRecoveryDialogComponent } from './password-recovery-dialog/password-recovery-dialog.component';


@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent {

  // Variables
  private token: string;

  constructor(
    private matdialog: MatDialog,
    private route: ActivatedRoute,
  ) {
    // Query params
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('user');
    });

    // Open update password dialog
    matdialog.open(DialogComponent, {
      disableClose: true, data: {
        component: PasswordRecoveryDialogComponent, token: this.token
      }
    });
  }

}
