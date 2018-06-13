import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatExpansionPanel, MatSidenav, MatSlideToggle } from '@angular/material';
import { RouterOutlet } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { UserService } from '../_modules/users/user.service';
import { SidenavService } from './sidenav.service';
import { SidenavContent } from './sidenav.types';
import { fadeAnimation } from '../_modules/_shared/services/animations.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  animations: [fadeAnimation()]
})
export class SidenavComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription;

  // Get elements
  @ViewChild('drawer') private drawer: MatSidenav;
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
  public sidenavContent: SidenavContent;
  public isLoggedIn = false;

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
  public isMobile$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
    .pipe(map(result => result.matches));

  // Methods
  public tabChange() {
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
      setTimeout(() => {
        switch (sidenavToggle) {
          case 'open': this.drawer.open(); break;
          case 'close': this.drawer.close(); break;
          case 'toggle': this.drawer.toggle(); break;
          default: this.drawer.open();
        }
      });
    });
    this.subscriptions.add(subscription);
  }

  private toggleExpansions() {
    const subscription = this.sidenavService.expansionToggle$.subscribe(expansionToggle => {
      setTimeout(() => {
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
      });
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
    private breakpointObserver: BreakpointObserver,
    private sidenavService: SidenavService,
    private userService: UserService,
  ) {

    this.sideNavContentChange();
    this.toggleSidenav();
    this.toggleExpansions();
    this.toggleIsLoggedIn();
  }

  ngOnInit() {
    this.userService.checkLogin();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
