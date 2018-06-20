import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContentPageDocumentLean } from '../../../../../../server/database/models/content/content.types';
import { SidenavService } from '../../../sidenav/sidenav.service';
import { ContentService } from '../../content/content.service';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styles: [`

  #contact-details {
    width: 300px;
  }
  .social-buttons {
    font-size: 50px;
  }
  .title {
    padding: 0;
    margin: 0;
  }
  `]
})
export class ContactDetailsComponent implements OnInit, OnDestroy {

  public page: ContentPageDocumentLean;
  public infoPage: ContentPageDocumentLean;

  private subscriptions = new Subscription;

  // Methods
  public getImageId = (ref: string) => this.contentService.getImageId(ref, this.page);

  // Life cycle
  constructor(
    private sidenavService: SidenavService,
    private contentService: ContentService,
  ) {
  }

  ngOnInit() {
    const contactPage = this.contentService.getContentPage('contact').subscribe(response => {
      this.page = response;
    });
    this.subscriptions.add(contactPage);

    const infoPage = this.sidenavService.infoPage$.subscribe(response => {
      this.infoPage = response;
    });
    this.subscriptions.add(infoPage);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
