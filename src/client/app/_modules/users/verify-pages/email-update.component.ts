import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { DialogComponent, DialogContent } from '../../_shared/components/dialog/dialog.component';
import { UserService } from '../user.service';


@Component({
  selector: 'app-verify-user',
  template: '',
  styles: ['']
})
export class EmailUpdateComponent {

  // Variables
  private token: string;

  // Methods
  public verifyEmail() {

    // Verify e-mail with token
    this.userService.updateEmail(this.token).subscribe(response => {

      // Open the dialog
      const data: DialogContent = { dialogData: { title: response, body: '', button: 'Cool!' }};
      const verifyDialog = this.matDialog.open(DialogComponent, { data, disableClose: true, });

      // Redirect
      verifyDialog.afterClosed().subscribe(() => { this.router.navigate(['/user']); });

      // Catch errors
    }, (error) => {
      // Open the dialog
      const data: DialogContent = { dialogData: { title: 'Something went wrong', body: error.message, button: 'Hmmmm...', }};
      const verifyDialog = this.matDialog.open(DialogComponent, { data, disableClose: true });

      // Redirect
      verifyDialog.afterClosed().subscribe(() => { this.router.navigate(['/home']); });
    });
  }

  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
  ) {
    // Get token from url
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('user');
    });

    // Verify e-mail
    this.verifyEmail();
  }

}
