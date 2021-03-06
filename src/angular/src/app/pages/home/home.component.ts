import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContentPageDocumentLean } from '../../../../../server/database/models/content/content.types';
import { SidenavService } from '../../sidenav/sidenav.service';
import { MatToggle, MatToggleExp, SidenavContent } from '../../sidenav/sidenav.types';
import { ContentService } from '../../_modules/content/content.service';
import { SharedService } from '../../_modules/_shared/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription;

  public isMobile$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
    .pipe(map(result => result.matches));

  // Variables
  public page: ContentPageDocumentLean;

  // Sidenav config
  private sidenavToggle: MatToggle = 'close';
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
        items: this.page.texts.map(x => ({ label: x.header, path: x.header })),
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
    private breakpointObserver: BreakpointObserver,
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
