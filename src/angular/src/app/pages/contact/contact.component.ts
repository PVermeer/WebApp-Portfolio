import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContentPageDocumentLean } from '../../../../../server/database/models/content/content.types';
import { SidenavService } from '../../sidenav/sidenav.service';
import { MatToggle, MatToggleExp, SidenavContent } from '../../sidenav/sidenav.types';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styles: ['']
})
export class ContactComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription;

  // Variables
  public page: ContentPageDocumentLean;

  // Sidenav config
  private sidenavToggle: MatToggle = 'close';
  private expansionToggle: MatToggleExp = 'open';

  // Sidenav content
  private sidenavContent: SidenavContent;

  // Methods
  private getPage() {
    const getPage = this.route.data.subscribe((data: { page: ContentPageDocumentLean; }) => {

      this.page = data.page;

      this.sidenavContent = [{
        title: this.page.info.title,
        items: this.page.texts.map(x => ({ label: x.header, path: x.header })),
      }];

    }, () => { }
    );
    this.subscriptions.add(getPage);
  }

  // Life cycle
  constructor(
    private sidenavService: SidenavService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getPage();

    this.sidenavService.passSidenavContent(this.sidenavContent);
    this.sidenavService.passExpansionToggle(this.expansionToggle);
    this.sidenavService.passSidenavToggle(this.sidenavToggle);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
