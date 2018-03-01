import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { SidenavContent } from '../_models/sidenav';

@Injectable()
export class SidenavService {

  // Events
  private sidenavContentSource = new Subject<SidenavContent[]>();

  public sidenavContent$ = this.sidenavContentSource.asObservable();

  passSidenavContent(sidenavContent: SidenavContent[]) {
    this.sidenavContentSource.next(sidenavContent);
  }

}
