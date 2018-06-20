import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { ContentPageDocumentLean } from '../../../../../server/database/models/content/content.types';

@Directive({
  selector: '[appContentList]'
})
export class ContentListDirective implements OnChanges, AfterViewInit {

  @Input('page') page: ContentPageDocumentLean;
  @Input('ref') ref: string;

  private setList() {

    if (!this.page) { return; }

    const pageList = this.page.lists.find(x => x.ref === this.ref);
    if (!pageList) { this.elementRef.nativeElement.innerHTML = 'LIST NOT FOUND'; }

    this.elementRef.nativeElement.list = pageList;
  }

  constructor(
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnChanges() {
    this.setList();
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

}
