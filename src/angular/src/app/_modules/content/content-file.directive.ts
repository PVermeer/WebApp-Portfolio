import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Input, OnChanges, HostListener } from '@angular/core';
import { ContentPageDocumentLean } from '../../../../../server/database/models/content/content.types';
import { ContentService } from './content.service';

@Directive({
  selector: '[appContentFile]'
})
export class ContentFileDirective implements OnChanges, AfterViewInit {

  // Variables
  private id: string;
  private filename: string;

  @Input('page') page: ContentPageDocumentLean | string;
  @Input('ref') ref: string;
  @HostListener('click') onClick() { return this.downloadFile(); }

  // Methods
  private setFile() {

    if (!this.page) { this.errorHandler(); return; }

    if (typeof this.page === 'string') {
      const page = this.page as string;

      this.contentService.getContentPage(page).subscribe(response => {

        this.handlePageInput(response);

      }, () => this.errorHandler()
      );
    } else { this.handlePageInput(this.page); }

  }

  private handlePageInput(page: ContentPageDocumentLean) {

    const pageFile = page.files.find(x => x.ref === this.ref);
    if (!pageFile) {
      this.elementRef.nativeElement.innerHTML = 'FILE NOT FOUND';
    } else {
      this.id = pageFile.file as string;
      this.filename = pageFile.title;
      this.elementRef.nativeElement.file = pageFile;
    }
  }

  public downloadFile() {

    this.contentService.getFile(this.id).subscribe(response => {

      // Fix for edge
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(response, this.filename);
      } else {

        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = this.filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }

      // On errors
    }, (error) => { console.log(error); }
    );
  }

  private errorHandler() { this.elementRef.nativeElement.innerHTML = 'FILE NOT FOUND'; }

  constructor(
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    private contentService: ContentService
  ) { }

  ngOnChanges() {
    this.setFile();
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

}
