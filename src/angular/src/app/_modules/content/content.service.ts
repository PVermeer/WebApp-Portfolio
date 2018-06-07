import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContentPageDocumentLean, ContentPageModel } from '../../../../../server/database/models/content/content.types';

@Injectable()
export class ContentService {

  constructor(
    private http: HttpClient,
  ) { }

  // Methods
  /**
   * Find the id of an image title in page document.
   * @param title Search value
   * @returns The id of an image
   */
  public getImageId(title: string, page: ContentPageDocumentLean) {
    if (title && page) {
      const imageObject = page.images.find(x => x.title === title);
      if (!imageObject) { return null; }

      return imageObject.image as string;
    }
    return null;
  }

  // Backend http requests
  public getContentPage(page: string) {
    return this.http.get<ContentPageDocumentLean>('/content/page?page=' + page);
  }
  public newContentPage(page: ContentPageModel) {
    return this.http.post<string>('/content/newpage', page);
  }
  public updateContentPage(page: FormData) {
    return this.http.post<string>('/content/updatepage', page);
  }
  public deleteContentPage(_id: string) {
    return this.http.delete<string>('/content/deletepage/' + _id);
  }
  public getAllContentPages() {
    return this.http.get<Array<ContentPageDocumentLean>>('/content/getpages');
  }
  public getImage(id: string) {
    return this.http.get('/content/image?id=' + id, { responseType: 'blob' });
  }

}
