import { Component, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material';

import { SidenavContent } from '../../_models/sidenav';
import { SidenavService } from '../../_services/sidenav.service';
import { ScrollIntoViewService } from '../../_services/scroll-into-view.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  providers: [
    MediaMatcher,
    SidenavService,
    ScrollIntoViewService
  ],
})
export class SidenavComponent implements OnDestroy {

  // Get elements for toggle options
  @ViewChild('sidenav') sidenav: MatSidenav;

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

  // Smooth scroll
  public scrollTo(element) { this.scrollIntoView.scrollIntoView(element); }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private sidenavService: SidenavService,
    private scrollIntoView: ScrollIntoViewService,
  ) {
    // Sidenav mobile support
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    // Change sidenav contents based on route
    this.sideNavContentChange(sidenavService);

    // Toggle materials based on route
    this.toggleSidenav(sidenavService);
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

  private toggleSidenav(sidenavService: SidenavService) {
    sidenavService.sidenavToggle$.subscribe(sidenavToggle => {
      setTimeout(() => {
        if (sidenavToggle === 'open') {
          this.sidenav.open();
          return;
        }
        if (sidenavToggle === 'close') {
          this.sidenav.close();
          return;
        }
        if (sidenavToggle === 'toggle') {
          this.sidenav.toggle();
          return;
        }
      }, 0);
    });
  }

}
