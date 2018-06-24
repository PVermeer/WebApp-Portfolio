import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContentPageDocumentLean } from '../../../../../server/database/models/content/content.types';
import { SidenavService } from '../../sidenav/sidenav.service';
import { MatToggle, MatToggleExp, SidenavContent } from '../../sidenav/sidenav.types';
import { ContentService } from '../../_modules/content/content.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription;

  // Variables
  public experienceBackground: { 'background-image': string };
  public appInfo: ContentPageDocumentLean;

  // Sidenav config
  private sidenavToggle: MatToggle = 'open';
  private expansionToggle: MatToggleExp = 'open';
  public page: ContentPageDocumentLean;

  // Sidenav content
  private sidenavContent: SidenavContent;

  // Methods
  public getImageId = (ref: string) => this.contentService.getImageId(ref, this.page);

  private getPage() {

    const getPage = this.route.data.subscribe((data: { page: ContentPageDocumentLean; }) => {

      this.page = data.page;

      this.sidenavContent = [{
        title: this.page.info.title,
        items: this.page.texts.map(x => ({ label: x.header, path: x.header })),
      }];

    }, () => { });
    this.subscriptions.add(getPage);
  }

  private timeLineBackground() {
    const experienceBackgroundId = this.getImageId('timeline_background');
    this.contentService.getImage(experienceBackgroundId).subscribe(response => {
      const reader = new FileReader();
      reader.onload = () => this.experienceBackground = { 'background-image': 'URL(' + reader.result + ')' };
      reader.readAsDataURL(response);
      // On errors
    }, () => { });
  }

  // Life cycle
  constructor(
    private sidenavService: SidenavService,
    private contentService: ContentService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.getPage();
    this.timeLineBackground();

    // Sidenav config
    this.sidenavService.passSidenavContent(this.sidenavContent);
    this.sidenavService.passExpansionToggle(this.expansionToggle);
    this.sidenavService.passSidenavToggle(this.sidenavToggle);

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
