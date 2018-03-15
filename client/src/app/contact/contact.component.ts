import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SidenavService } from '../_services/sidenav.service';
import { SidenavContent, MatToggleExp, MatToggle } from '../_models/sidenav.model';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, AfterViewInit {

  public title = 'Neem contact op!';

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
