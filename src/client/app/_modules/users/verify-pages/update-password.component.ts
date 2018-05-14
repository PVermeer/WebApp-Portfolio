import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { DialogComponent, DialogContent } from '../../_shared/components/dialog/dialog.component';
import { PasswordRecoveryDialogComponent } from './password-recovery-dialog/password-recovery-dialog.component';


@Component({
  selector: 'app-update-password',
  template: '',
  styles: ['']
})
export class UpdatePasswordComponent {

  // Variables
  private token: string;

  constructor(
    private matdialog: MatDialog,
    private route: ActivatedRoute,
  ) {
    // Get token from url
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('user');
    });

    // Open update password dialog
    const data: DialogContent = {
      component: PasswordRecoveryDialogComponent,
      token: this.token,
    };
    this.matdialog.open(DialogComponent, { data, disableClose: true});
  }

}
