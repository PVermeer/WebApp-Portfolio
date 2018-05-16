import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ContentPageDocumentLean, ContentPageModel } from '../../../../server/database/models/content/content.types';

@Injectable()
export class ContentService {

  constructor(
    private http: HttpClient,
  ) { }

  // Methods

  // Backend http requests
  public getContentPage(id: string): Observable<string> {
    return this.http.get<string>('/content/page?' + id);
  }
  public newContentPage(page: ContentPageModel): Observable<string> {
    return this.http.post<string>('/content/newpage', page);
  }
  public updateContentPage(page: FormData): Observable<string> {
    return this.http.post<string>('/content/updatepage', page);
  }
  public deleteContentPage(_id: string): Observable<string> {
    return this.http.delete<string>('/content/deletepage/' + _id);
  }
  public getAllContentPages(): Observable<ContentPageDocumentLean[]> {
    return this.http.get<Array<ContentPageDocumentLean>>('/content/getpages');
  }
  public getImage(id: string) {
    return this.http.get('/content/image?id=' + id, { responseType: 'blob' });
  }

}
