import { Component, AfterViewInit, OnInit } from '@angular/core';

import { UserService } from './user.service';
import { MatToggle, MatToggleExp, SidenavContent } from '../../sidenav/sidenav.model';
import { SidenavService } from '../../sidenav/sidenav.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [],
})
export class UserComponent implements OnInit, AfterViewInit {

  // Variables
  public isAdmin = false;

  // Sidenav config
  private sidenavToggle: MatToggle = 'open';
  private expansionToggle: MatToggleExp = 'open';

  // Sidenav content
  private sidenavContent: SidenavContent[] = [{
    title: 'User page',
    items: [
      { label: 'User details', path: 'userDetails' },
    ],
  }];

  public logout() { this.userService.logout(); }

  constructor(
    private sidenavService: SidenavService,
    private userService: UserService,
  ) {
    // User type
    this.getUsertype();
  }

  ngOnInit() {
    // Sidenav config
    this.sidenavService.passSidenavContent(this.sidenavContent);
    this.sidenavService.passExpansionToggle(this.expansionToggle);
  }

  ngAfterViewInit() {
    // Sidenav config
    this.sidenavService.passSidenavToggle(this.sidenavToggle);
  }

  // ---------------------------------------------------------------------------

  // Constructor methods
  private getUsertype() {
    this.userService.userType$.subscribe(type => {
      if (type.rank > 1) {
        this.sidenavContent[0].items.unshift({ label: 'Admin panel', path: 'admin' });
        this.isAdmin = true;
      }
    });
    this.userService.passUserType();
  }

}
