import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatToggle, MatToggleExp, SidenavContent } from './sidenav.types';

@Injectable()
export class SidenavService {

  // Events
  private sidenavContentSource = new Subject<SidenavContent>();
  private sidenavToggleSource = new Subject<MatToggle>();
  private expansionToggleSource = new Subject<MatToggleExp>();
  private themeToggleSource = new Subject<boolean>();

  public sidenavContent$ = this.sidenavContentSource.asObservable();
  public sidenavToggle$ = this.sidenavToggleSource.asObservable();
  public expansionToggle$ = this.expansionToggleSource.asObservable();
  public themeToggle$ = this.themeToggleSource.asObservable();

  public passSidenavContent(sidenavContent: SidenavContent) {
    this.sidenavContentSource.next(sidenavContent);
  }
  public passSidenavToggle(sidenavToggle: MatToggle) {
    this.sidenavToggleSource.next(sidenavToggle);
  }
  public passExpansionToggle(expansionToggle: MatToggleExp) {
    this.expansionToggleSource.next(expansionToggle);
  }
  public passThemeToggle(themeToggle: boolean) {
    this.themeToggleSource.next(themeToggle);
  }

  // Methods
  public scrollIntoView(element: string) {
    const scrollToElement = document.getElementById(element);
    scrollToElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
  }

}
