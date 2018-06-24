import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentPageDocumentLean } from '../../../../../server/database/models/content/content.types';
import { SidenavService } from '../../sidenav/sidenav.service';
import { MatToggle, MatToggleExp, SidenavContent } from '../../sidenav/sidenav.types';
import { ContentService } from '../../_modules/content/content.service';
import { SharedService } from '../../_modules/_shared/services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturesComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription;

  // Variables
  public page: ContentPageDocumentLean;

  // Sidenav config
  private sidenavToggle: MatToggle = 'open';
  private expansionToggle: MatToggleExp = 'open';

  // Sidenav content
  private sidenavContent: SidenavContent;

  // Methods
  public getImageId = (ref: string) => this.contentService.getImageId(ref, this.page);
  public isEven = (number: number) => this.sharedService.isEven(number);

  private getPage() {
    const getPage = this.route.data.subscribe((data: { page: ContentPageDocumentLean; }) => {

      this.page = data.page;

      this.sidenavContent = [{
        title: this.page.info.title,
        items: this.page.lists.find(x => x.ref === 'list_titles').list.map(y => ({ label: y[0], path: y[0] }))
      }];

    }, () => { }
    );
    this.subscriptions.add(getPage);
  }


  // Life cycle
  constructor(
    private sidenavService: SidenavService,
    private contentService: ContentService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
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
