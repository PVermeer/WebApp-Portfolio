import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { DialogComponent } from '../../../_shared/dialog/dialog.component';
import { UserService } from '../../user.service';
import { SnackbarComponent } from '../../../_shared/snackbar/snackbar.component';


@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.css']
})
export class VerifyUserComponent {

  // Variables
  private token: string;

  // Methods
  public verifyEmail() {
    this.userService.verifyEmail(this.token).subscribe(response => {
      const dialogData = {
        title: '',
        body: '',
        button: '',
      };

      if (response.error) {
        dialogData.title = response.error;
        dialogData.button = 'Hmmmm...';
        this.snackbarComponent.snackbarError(response.error);
      }
      if (response.success) {
        dialogData.title = response.success;
        dialogData.button = 'Cool!';
        this.snackbarComponent.snackbarSucces(response.success);
      }

      const verifyDialog = this.matDialog.open(DialogComponent, { disableClose: true, data: { dialogData }});
      verifyDialog.afterClosed().subscribe(() => {
        this.router.navigate(['/user']);
      });
    });
  }

  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private snackbarComponent: SnackbarComponent,
  ) {
    // Query params
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('user');
    });

    // Verify e-mail
    this.verifyEmail();
  }

}
