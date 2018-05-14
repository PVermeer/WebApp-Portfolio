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
  public getContent(id: string): Observable<string> {
    return this.http.get<string>('/content/page?' + id);
  }
  public newContent(page: ContentPageModel): Observable<string> {
    return this.http.post<string>('/content/newpage', page);
  }
  public updateContent(page: FormData): Observable<string> {
    return this.http.post<string>('/content/updatepage', page);
  }
  public getAllContent(): Observable<ContentPageDocumentLean[]> {
    return this.http.get<Array<ContentPageDocumentLean>>('/content/getpages');
  }
  public getImage(id: string) {
    return this.http.get('/content/image?id=' + id, { responseType: 'blob' });
  }

}
