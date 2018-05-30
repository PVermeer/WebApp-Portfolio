import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogComponent, DialogContent } from '../../_shared/components/dialog/dialog.component';
import { PasswordRecoveryDialogComponent } from './password-recovery-dialog/password-recovery-dialog.component';

@Component({
  selector: 'app-update-password',
  template: '',
  styles: ['']
})
export class UpdatePasswordComponent implements OnDestroy {

  // Variables
  private token: string;

  private subscriptions = new Subscription;

  // Lifecycle
  constructor(
    private matdialog: MatDialog,
    private route: ActivatedRoute,
  ) {
    // Get token from url
    const subscription = this.route.queryParamMap.subscribe(params => {
      this.token = params.get('user');
    });
    this.subscriptions.add(subscription);

    // Open update password dialog
    const data: DialogContent = {
      component: PasswordRecoveryDialogComponent,
      token: this.token,
    };
    this.matdialog.open(DialogComponent, { data, disableClose: true });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
