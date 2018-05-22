import { Component, OnInit } from '@angular/core';

import { SidenavService } from '../../sidenav/sidenav.service';
import { SidenavContent, MatToggle, MatToggleExp } from '../../sidenav/sidenav.types';
import { ContentService } from '../../_modules/content/content.service';
import { ContentPageDocumentLean } from '../../../../server/database/models/content/content.types';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  // Page
  private title = 'Home';
  public page$: Observable<ContentPageDocumentLean>;
  public page: ContentPageDocumentLean;

  // Sidenav config
  private sidenavToggle: MatToggle = 'open';
  private expansionToggle: MatToggleExp = 'open';

  // Sidenav content
  private sidenavContent: SidenavContent;

  // Methods
  public getImageId(title: string) { return this.contentService.getImageId(title, this.page); }

  constructor(
    private sidenavService: SidenavService,
    private contentService: ContentService,
  ) { }

  ngOnInit() {
    this.contentService.getContentPage(this.title).subscribe(response => {

      this.page$ = of(response as ContentPageDocumentLean);
      this.page = response;

      // Sidenav config
      this.sidenavContent = [{
        title: this.title,
        items: response.texts.map(x => ({ label: x.header, path: x.header })),
      }];
      this.sidenavService.passSidenavContent(this.sidenavContent);
      this.sidenavService.passExpansionToggle(this.expansionToggle);
      this.sidenavService.passSidenavToggle(this.sidenavToggle);
    });
  }

}
