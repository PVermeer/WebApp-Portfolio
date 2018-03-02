import { Component, ChangeDetectorRef, OnDestroy, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav, MatExpansionPanel } from '@angular/material';

import { SidenavContent } from '../../_models/sidenav';
import { SidenavService } from '../../_services/sidenav.service';
import { ScrollIntoViewService } from '../../_services/scroll-into-view.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  providers: [
    MediaMatcher,
    ScrollIntoViewService,
  ],
})
export class SidenavComponent implements OnDestroy {

  // Get elements for toggle options
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild('expHomeNav') expHomeNav: MatExpansionPanel;
  @ViewChildren('expRouteNav') expRoutedNav: QueryList<MatExpansionPanel>;

  // App sidenav config
  public title = 'app';
  public pageNav: SidenavContent[] = [{
    title: 'Navigation',
    items: [
      { label: 'Home', path: 'home' },
    ],
  }];

  // Variables
  public mobileQuery: MediaQueryList;
  public sidenavContent: SidenavContent[];
  private _mobileQueryListener: () => void;

  // Smooth scroll
  public scrollTo(element) { this.scrollIntoView.scrollIntoView(element); }

  // Toggle theme for entire app
  private toggleTheme(event) {
    const { checked } = event;
    this.sidenavService.passThemeToggle(checked);
  }

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
    this.toggleExpansions(sidenavService);
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

  private toggleExpansions(sidenavService: SidenavService) {
    sidenavService.expansionToggle$.subscribe(expansionToggle => {
      setTimeout(() => {
        this.expHomeNav.close();
        if (expansionToggle === 'open') {
          this.expRoutedNav.forEach((child) => { child.open(); return; });
        }
        if (expansionToggle === 'close') {
          this.expRoutedNav.forEach((child) => { child.close(); return; });
        }
        if (expansionToggle === 'toggle') {
          this.expRoutedNav.forEach((child) => { child.toggle(); return; });
        }
        if (expansionToggle === 'home') {
          this.expHomeNav.open();
          return;
        }
      }, 0);
    });
  }

}
