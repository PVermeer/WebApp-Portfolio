import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatToggle, MatToggleExp, SidenavContent } from '../../sidenav/sidenav.types';
import { SidenavService } from '../../sidenav/sidenav.service';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, AfterViewInit {

  // Sidenav config
  private sidenavToggle: MatToggle = 'open';
  private expansionToggle: MatToggleExp = 'open';

  // Sidenav content
  private sidenavContent: SidenavContent = [{
    title: 'About',
    items: [
      { label: 'Something', path: 'about' },
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
