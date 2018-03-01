import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { SidenavContent, MatToggle } from '../_models/sidenav';

@Injectable()
export class SidenavService {

  // Events
  private sidenavContentSource = new Subject<SidenavContent[]>();
  private sidenavToggleSource = new Subject<MatToggle>();

  public sidenavContent$ = this.sidenavContentSource.asObservable();
  public sidenavToggle$ = this.sidenavToggleSource.asObservable();

  passSidenavContent(sidenavContent: SidenavContent[]) {
    this.sidenavContentSource.next(sidenavContent);
  }
  passSidenavToggle(sidenavToggle: MatToggle) {
    this.sidenavToggleSource.next(sidenavToggle);
  }

}
