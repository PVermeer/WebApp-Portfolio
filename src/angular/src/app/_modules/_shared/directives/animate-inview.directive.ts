import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { auditTime } from 'rxjs/operators';

@Directive({
  selector: '[appAnimateInview]'
})
export class AnimateInviewDirective implements OnInit, OnDestroy {

  private contentDiv: HTMLElement;
  private subscriptions = new Subscription;

  @Input('appAnimateInview') appAnimateInview: string;

  private checkInView() {

    const animation = this.appAnimateInview;
    const element = this.elementRef.nativeElement;

    const elementRec = element.getBoundingClientRect();
    const contentDivRec = this.contentDiv.getBoundingClientRect();

    const elementTop = elementRec.top - contentDivRec.top;
    const elementHeight = elementRec.height;
    const elementBottom = elementTop + elementHeight;
    const contentDivHeight = contentDivRec.height;

    if (elementBottom > 0 && elementBottom < contentDivHeight) {
      entry();
    }
    if (elementBottom < 0 || elementTop > contentDivHeight) {
      leave();
    }

    function entry() {
      element.classList.add('animated'); // https://github.com/daneden/animate.css/
      element.classList.remove('hide');
      element.classList.add(animation);
    }
    function leave() {
      element.classList.remove('animated'); // https://github.com/daneden/animate.css/
      element.classList.add('hide');
      element.classList.remove(animation);
    }
  }

  // Life cycle
  constructor(
    private elementRef: ElementRef,
  ) {
    this.contentDiv = document.getElementById('sidenav-content');
  }
  ngOnInit() {
    this.checkInView();

    const scroll = fromEvent(this.contentDiv, 'scroll').pipe(auditTime(100)).subscribe(() => this.checkInView());
    const resize = fromEvent(this.contentDiv, 'resize').pipe(auditTime(100)).subscribe(() => this.checkInView());

    this.subscriptions.add(scroll);
    this.subscriptions.add(resize);
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
