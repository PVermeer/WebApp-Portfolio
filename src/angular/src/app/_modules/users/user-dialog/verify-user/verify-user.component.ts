import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogComponent, DialogContent } from '../../../_shared/components/dialog/dialog.component';
import { UserService } from '../../user.service';


@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.css']
})
export class VerifyUserComponent implements OnDestroy {

  // Variables
  private token: string;

  private subscription = new Subscription;

  // Methods
  public verifyEmail() {

    // Verify e-mail with token
    this.userService.verifyEmail(this.token).subscribe(response => {

      // Open the dialog
      const data: DialogContent = { dialogData: { title: response, body: '', button: 'Cool!' } };
      const verifyDialog = this.matDialog.open(DialogComponent, { data, disableClose: true, });

      // Redirect
      verifyDialog.afterClosed().subscribe(() => { this.router.navigate(['/user']); });

      // Catch errors
    }, (error) => {
      // Open the dialog
      const data: DialogContent = { dialogData: { title: 'Something went wrong', body: error.message, button: 'Hmmmm...', } };
      const verifyDialog = this.matDialog.open(DialogComponent, { data, disableClose: true });

      // Redirect
      verifyDialog.afterClosed().subscribe(() => { this.router.navigate(['/home']); });
    });
  }

  // Life cycle
  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
  ) {
    // Get token from url
    const subscription = this.route.queryParamMap.subscribe(params => {
      this.token = params.get('user');
    });
    this.subscription.add(subscription);
    // Verify e-mail
    this.verifyEmail();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
