import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ContentPageDocumentLean } from '../../../../server/database/models/content/content.types';
import { ContentService } from '../_modules/content/content.service';

@Injectable()
export class PageResolver implements Resolve<ContentPageDocumentLean> {

  constructor(
    private contentService: ContentService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<ContentPageDocumentLean> {

    const routePage = route.url[0].path;

    return this.contentService.getContentPage(routePage).pipe(
      take(1),
      map(page => {
        if (page) {
          return page;
        } else {
          this.router.navigate(['error']);
          return null;
        }
      })
    );
  }
}
