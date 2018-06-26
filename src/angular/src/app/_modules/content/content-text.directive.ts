import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { ContentPageDocumentLean } from '../../../../../server/database/models/content/content.types';

@Directive({
  selector: '[appContentText]'
})
export class ContentTextDirective implements OnChanges, AfterViewInit {

  @Input('page') page: ContentPageDocumentLean;
  @Input('ref') ref: string;

  private setText() {

    if (!this.page) { return; }

    const pageText = this.page.texts.find(x => x.ref === this.ref);
    if (!pageText) { this.elementRef.nativeElement.innerHTML = 'TEXT NOT FOUND'; }

    this.elementRef.nativeElement.text = pageText;
  }

  constructor(
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnChanges() {
    this.setText();
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

}
