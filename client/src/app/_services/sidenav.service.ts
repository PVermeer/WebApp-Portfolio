import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { SidenavContent, MatToggle, MatToggleExp } from '../_models/sidenav';

@Injectable()
export class SidenavService {

  // Events
  private sidenavContentSource = new Subject<SidenavContent[]>();
  private sidenavToggleSource = new Subject<MatToggle>();
  private expansionToggleSource = new Subject<MatToggleExp>();

  public sidenavContent$ = this.sidenavContentSource.asObservable();
  public sidenavToggle$ = this.sidenavToggleSource.asObservable();
  public expansionToggle$ = this.expansionToggleSource.asObservable();

  passSidenavContent(sidenavContent: SidenavContent[]) {
    this.sidenavContentSource.next(sidenavContent);
  }
  passSidenavToggle(sidenavToggle: MatToggle) {
    this.sidenavToggleSource.next(sidenavToggle);
  }
  passExpansionToggle(expansionToggle: MatToggleExp) {
    this.expansionToggleSource.next(expansionToggle);
  }

}
