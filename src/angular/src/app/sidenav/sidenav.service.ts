import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ContentPageDocumentLean } from '../../../../server/database/models/content/content.types';
import { MatToggle, MatToggleExp, SidenavContent } from './sidenav.types';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
}) export class SidenavService {

  // Events
  private sidenavContentSource = new Subject<SidenavContent>();
  private sidenavToggleSource = new Subject<MatToggle>();
  private expansionToggleSource = new Subject<MatToggleExp>();
  private themeToggleSource = new Subject<boolean>();
  private infoPageSource = new BehaviorSubject<ContentPageDocumentLean>(undefined);

  public sidenavContent$ = this.sidenavContentSource.asObservable();
  public sidenavToggle$ = this.sidenavToggleSource.asObservable();
  public expansionToggle$ = this.expansionToggleSource.asObservable();
  public themeToggle$ = this.themeToggleSource.asObservable();
  public infoPage$ = this.infoPageSource.asObservable();

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
  public passInfoPage(infoPage: ContentPageDocumentLean) {
    this.infoPageSource.next(infoPage);
  }

  // Methods
  public scrollIntoView(element: string) {
    const scrollToElement = document.getElementById(element);
    scrollToElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
  }
  public checkForScrollHash() {
    const hashSplit = this.router.url.split('#');

    if (hashSplit.length > 1) {
      const hash = decodeURI(hashSplit[1]);
      this.scrollIntoView(hash);
    }
  }

  constructor(
    private router: Router,
  ) { }


}
