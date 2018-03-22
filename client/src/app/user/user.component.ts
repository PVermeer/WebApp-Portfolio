import { Component, AfterViewInit, OnInit } from '@angular/core';

import { UserService } from '../_services/user.service';
import { MatToggle, MatToggleExp, SidenavContent } from '../_models/sidenav.model';
import { SidenavService } from '../_services/sidenav.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [UserService],
})
export class UserComponent implements OnInit, AfterViewInit {

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

  public logout() {
    this.userService.logout();
  }

  constructor(
    private sidenavService: SidenavService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    // Sidenav config
    this.sidenavService.passSidenavContent(this.sidenavContent);
    this.sidenavService.passExpansionToggle(this.expansionToggle);
  }

  ngAfterViewInit() {
    // Sidenav config
    this.sidenavService.passSidenavToggle(this.sidenavToggle);
  }

}
