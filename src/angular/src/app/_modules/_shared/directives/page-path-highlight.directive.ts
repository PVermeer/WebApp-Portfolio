import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { auditTime } from 'rxjs/operators';

@Directive({
  selector: '[appPagePathHighlight]'
})
export class PagePathHighlightDirective implements OnInit, OnDestroy {

  private contentDiv: HTMLElement;
  private subscriptions = new Subscription;

  @Input('appPagePathHighlight') appPagePathHighlight: string;

  public checkInView(): void {

    if (!this.appPagePathHighlight) { return; }

    const element = this.elementRef.nativeElement;
    const targetElement = document.getElementById(this.appPagePathHighlight);
    if (!targetElement) { return; }

    const targetElementRec = targetElement.getBoundingClientRect();
    const contentDivRec = this.contentDiv.getBoundingClientRect();

    const elementTop = targetElementRec.top - contentDivRec.top;
    const elementHeight = targetElementRec.height;
    const elementBottom = elementTop + elementHeight;
    const contentDivHeight = contentDivRec.height;

    if (elementBottom > 0 && elementBottom < contentDivHeight / 3) {
      entry();
    }
    if (elementBottom < 0 || elementTop > contentDivHeight / 3) {
      leave();
    }

    function entry() {
      element.classList.add('active-link');
    }
    function leave() {
      element.classList.remove('active-link');
    }
  }

  // Lifecycle
  constructor(
    private elementRef: ElementRef,
  ) {
    this.contentDiv = document.getElementById('sidenav-content');
  }

  ngOnInit() {
    this.checkInView();

    const scroll = fromEvent(this.contentDiv, 'scroll').pipe(auditTime(500)).subscribe(() => this.checkInView());
    this.subscriptions.add(scroll);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
