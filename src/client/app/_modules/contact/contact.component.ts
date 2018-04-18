import { Component, OnInit, AfterViewInit } from '@angular/core';

import { MatToggle, MatToggleExp, SidenavContent } from '../../sidenav/sidenav.model';
import { SidenavService } from '../../sidenav/sidenav.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, AfterViewInit {

  public title = 'Contact me!';

  // Sidenav config
  private sidenavToggle: MatToggle = 'close';
  private expansionToggle: MatToggleExp = 'open';

  // Sidenav content
  private sidenavContent: SidenavContent[] = [{
    title: 'Contact',
    items: [
      { label: 'ContactSomething', path: 'contact' },
    ],
  }];

  constructor(
    private sidenavService: SidenavService,
  ) { }

  ngOnInit() {
    // Sidenav config
    this.sidenavService.passSidenavContent(this.sidenavContent);
    this.sidenavService.passExpansionToggle(this.expansionToggle);
  }

  ngAfterViewInit() {
    this.sidenavService.passSidenavToggle(this.sidenavToggle);
  }

}
