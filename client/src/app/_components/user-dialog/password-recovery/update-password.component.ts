import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PasswordRecoveryDialogComponent } from './password-recovery-dialog/password-recovery-dialog.component';
import { ActivatedRoute } from '@angular/router';

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
    matdialog.open(PasswordRecoveryDialogComponent, { disableClose: true, data: { token: this.token }});
  }

}
