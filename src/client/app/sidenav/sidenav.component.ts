import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatExpansionPanel, MatSidenav, MatSlideToggle } from '@angular/material';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../_modules/users/user.service';
import { SidenavService } from './sidenav.service';
import { SidenavContent } from './sidenav.types';
import { fadeAnimation } from '../_modules/_shared/services/animations.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  providers: [MediaMatcher],
  animations: [fadeAnimation()]
})
export class SidenavComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription;

  // Get elements
  @ViewChild('sidenav') private sidenav: MatSidenav;
  @ViewChild('expPageNav') private expPageNav: MatExpansionPanel;
  @ViewChildren('expRouteNav') private expRoutedNav: QueryList<MatExpansionPanel>;

  // Sidenav content
  public title = 'app';
  public pageNav: SidenavContent = [{
    title: 'Navigation',
    items: [
      { label: 'Home', path: 'home' },
      { label: 'About', path: 'about' },
      { label: 'Contact', path: 'contact' },
    ],
  }];

  // Variables
  public mobileQuery: MediaQueryList;
  public sidenavContent: SidenavContent;
  private _mobileQueryListener: () => void;
  public isLoggedIn = false;

  // Methods
  public tabChange() {
    // Scroll to top
    document.getElementById('sidenav-content').scrollTo({ top: 0, behavior: 'smooth' });
  }

  public scrollTo(element: string) { this.sidenavService.scrollIntoView(element); }

  public toggleTheme(event: MatSlideToggle) { this.sidenavService.passThemeToggle(event.checked); }

  public getState(outlet: RouterOutlet) { return outlet.activatedRouteData.state; }

  public login() { this.userService.login(); }

  public logout() { this.userService.logout(); }

  // Sidenav options
  private sideNavContentChange() {
    const subscription = this.sidenavService.sidenavContent$.subscribe(sidenavPassedContent => {
      this.sidenavContent = sidenavPassedContent;
      this.changeDetectorRef.detectChanges();
    });
    this.subscriptions.add(subscription);
  }

  private toggleSidenav() {
    const subscription = this.sidenavService.sidenavToggle$.subscribe(sidenavToggle => {
      if (this.mobileQuery.matches) { this.sidenav.close(); return; }
      setTimeout(() => {
        switch (sidenavToggle) {
          case 'open': this.sidenav.open(); break;
          case 'close': this.sidenav.close(); break;
          case 'toggle': this.sidenav.toggle(); break;
          default: this.sidenav.open();
        }
      }, 0);
    });
    this.subscriptions.add(subscription);
  }

  private toggleExpansions() {
    const subscription = this.sidenavService.expansionToggle$.subscribe(expansionToggle => {
      setTimeout(() => {

        if (this.mobileQuery.matches) {
          this.expPageNav.open();
        } else { this.expPageNav.close(); }

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
          this.expPageNav.open();
          return;
        }
      }, 0);
    });
    this.subscriptions.add(subscription);
  }

  private toggleIsLoggedIn() {
    const subscription = this.userService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    this.subscriptions.add(subscription);
  }

  // Life cycle
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private sidenavService: SidenavService,
    private userService: UserService,
  ) {
    // Sidenav mobile support
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    // Change sidenav content based on route
    this.sideNavContentChange();

    // Toggle sidenav based on route
    this.toggleSidenav();
    this.toggleExpansions();

    // Subscribe to login status
    this.toggleIsLoggedIn();
  }

  ngOnInit() {
    // Check if user still has valid tokens
    this.userService.checkLogin();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
