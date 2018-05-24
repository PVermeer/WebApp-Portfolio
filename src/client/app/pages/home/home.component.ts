import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ContentPageDocumentLean } from '../../../../server/database/models/content/content.types';
import { ContentService } from '../../_modules/content/content.service';
import { SidenavService } from '../../sidenav/sidenav.service';
import { MatToggle, MatToggleExp, SidenavContent } from '../../sidenav/sidenav.types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  // Variables
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

  // Life cycle
  constructor(
    private sidenavService: SidenavService,
    private contentService: ContentService,
  ) { }

  ngOnInit() {
    this.contentService.getContentPage(this.title).subscribe(response => {

      this.page$ = of(response);
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
