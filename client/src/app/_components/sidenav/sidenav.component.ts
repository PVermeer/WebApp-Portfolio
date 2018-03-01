import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

import { SidenavContent } from '../../_models/sidenav';
import { SidenavService } from '../../_services/sidenav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  providers: [MediaMatcher, SidenavService],
})
export class SidenavComponent implements OnDestroy {

  // Page navigation
  public pageNav: SidenavContent[] = [{
    title: 'Navigation',
    items: [
      { label: 'Home', path: 'home' },
    ],
  }];

  // Variables
  public title = 'app';
  public mobileQuery: MediaQueryList;
  public sidenavContent: SidenavContent[];
  private _mobileQueryListener: () => void;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private sidenavService: SidenavService,
  ) {
    // Sidenav mobile support
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    // Change sidenav contents based on route
    this.sideNavContentChange(sidenavService);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  // ---------------------------------------------------------------------------

  // Constructor methods
  private sideNavContentChange(sidenavService: SidenavService) {
    sidenavService.sidenavContent$.subscribe(sidenavPassedContent => {
      this.sidenavContent = sidenavPassedContent;
      this.changeDetectorRef.detectChanges();
    });
  }

}
