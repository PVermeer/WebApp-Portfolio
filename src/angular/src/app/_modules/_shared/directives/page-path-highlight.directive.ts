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

    const targetElementRec: ClientRect = targetElement.getBoundingClientRect();
    const contentDivRec: ClientRect = this.contentDiv.getBoundingClientRect();

    const elementTop = targetElementRec.top - contentDivRec.top;
    const elementHeight = targetElementRec.height;
    const elementBottom = elementTop + elementHeight;
    const contentDivHeight = contentDivRec.height;

    if (elementBottom > 0 || elementTop < contentDivHeight) {
      entry();
    }
    if (elementBottom < 0 || elementTop > contentDivHeight) {
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
    setTimeout(() => {
      this.checkInView();
    }, 100);

    const scroll = fromEvent(this.contentDiv, 'scroll').pipe(auditTime(500)).subscribe(() => this.checkInView());
    const resize = fromEvent(window, 'resize').pipe(auditTime(500)).subscribe(() => this.checkInView());

    this.subscriptions.add(scroll);
    this.subscriptions.add(resize);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
