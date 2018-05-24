import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserType } from '../../../../server/database/models/users/user.types';
import { UserService } from '../../_modules/users/user.service';
import { SidenavService } from '../../sidenav/sidenav.service';
import { MatToggle, MatToggleExp, SidenavContent } from '../../sidenav/sidenav.types';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [],
})
export class UserComponent implements OnInit, AfterViewInit, OnDestroy {

  // Variables
  private userType: UserType;
  public isAdmin = false;

  private subscriptions = new Subscription;

  // Sidenav config
  private sidenavToggle: MatToggle = 'open';
  private expansionToggle: MatToggleExp = 'open';

  // Sidenav content
  private sidenavContent: SidenavContent = [{
    title: 'User page',
    items: [
      { label: 'User details', path: 'userDetails' },
    ],
  }];

  // Methods
  public logout() { this.userService.logout(); }

  private applyUsertype() {
    if (this.userType.rank > 2) {
      this.sidenavContent[0].items.unshift({ label: 'Admin panel', path: 'admin' });
      this.isAdmin = true;
    }
  }

  // Life cycle
  constructor(
    private sidenavService: SidenavService,
    private userService: UserService,
  ) {
    // User type
    const subscription = this.userService.userType$.subscribe(type => {
      this.userType = type;
    });
    this.subscriptions.add(subscription);
  }

  ngOnInit() {
    // Sidenav config
    this.sidenavService.passSidenavContent(this.sidenavContent);
    this.sidenavService.passExpansionToggle(this.expansionToggle);
    this.applyUsertype();
  }

  ngAfterViewInit() {
    // Sidenav config
    this.sidenavService.passSidenavToggle(this.sidenavToggle);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
