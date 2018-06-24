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
    max-width: 350px;
  }
  .social-buttons {
    font-size: 50px;
  }
  .image {
  }
  .title {
    padding: 0;
    margin: 0;
    letter-spacing: 1px;
  }
  .text {
    font-weight: 400;
  }
  `]
})
export class ContactDetailsComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription;

  public infoPage: ContentPageDocumentLean;

  // Methods
  public getImageId = (ref: string) => this.contentService.getImageId(ref, this.infoPage);

  // Life cycle
  constructor(
    private contentService: ContentService,
    private sidenavservice: SidenavService,
  ) { }

  ngOnInit() {
    const infoPage = this.sidenavservice.infoPage$.subscribe(response => {
      this.infoPage = response;
    });
    this.subscriptions.add(infoPage);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
