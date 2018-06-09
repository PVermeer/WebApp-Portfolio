import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentPageDocumentLean } from '../../../../../server/database/models/content/content.types';
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
  public page: ContentPageDocumentLean;

  // Sidenav config
  private sidenavToggle: MatToggle = 'open';
  private expansionToggle: MatToggleExp = 'open';

  // Sidenav content
  private sidenavContent: SidenavContent;

  // Methods
  public getImageId(ref: string) { return this.contentService.getImageId(ref, this.page); }

  // Life cycle
  constructor(
    private sidenavService: SidenavService,
    private contentService: ContentService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { page: ContentPageDocumentLean }) => {

      const { page } = data;
      this.page = page;

      // Sidenav config
      this.sidenavContent = [{
        title: this.title,
        items: page.texts.map(x => ({ label: x.header, path: x.header })),
      }];
      this.sidenavService.passSidenavContent(this.sidenavContent);
      this.sidenavService.passExpansionToggle(this.expansionToggle);
      this.sidenavService.passSidenavToggle(this.sidenavToggle);
    }, () => { });
  }

}
