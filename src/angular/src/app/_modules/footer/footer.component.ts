import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContentPageDocumentLean } from '../../../../../server/database/models/content/content.types';
import { SidenavService } from '../../sidenav/sidenav.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription;

  // Variables
  public appInfo: ContentPageDocumentLean;

  constructor(
    private sidenavService: SidenavService,
  ) { }

  ngOnInit() {
    const appInfo = this.sidenavService.infoPage$.subscribe(response => {
      this.appInfo = response;
    });
    this.subscriptions.add(appInfo);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
