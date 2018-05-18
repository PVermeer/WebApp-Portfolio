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
  /**
   * @param title Search value
   */
  public getImageId(title: string, page: ContentPageDocumentLean) {
    if (page) {
      const imageObject = page.images.find(x => x.title === title);
      if (!imageObject) { return null; }

      return imageObject.image as string;
    }
    return null;
  }

  // Backend http requests
  public getContentPage(title: string): Observable<ContentPageDocumentLean> {
    return this.http.get<ContentPageDocumentLean>('/content/page?title=' + title);
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
