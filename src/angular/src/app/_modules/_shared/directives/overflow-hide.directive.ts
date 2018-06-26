import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { auditTime } from 'rxjs/operators';

@Directive({
  selector: '[appOverflowHide]'
})
export class OverflowHideDirective implements AfterViewInit, OnDestroy {

  private contentDiv: HTMLElement;
  private subscriptions = new Subscription;

  private checkInView() {

    const element: HTMLElement = this.elementRef.nativeElement;
    const elementRec: ClientRect = element.getBoundingClientRect();
    const contentDivRec: ClientRect = this.contentDiv.getBoundingClientRect();

    const elementRight = elementRec.right;
    const contentDivWidth = contentDivRec.width;

    if (elementRight > 0 && elementRight < contentDivWidth) {
      entry();
    } else {
      leave();
    }

    function entry() {
      element.classList.remove('hide');
    }
    function leave() {
      element.classList.add('hide');
    }
  }

  // Life cycle
  constructor(
    private elementRef: ElementRef,
  ) {
  }

  ngAfterViewInit() {
    this.contentDiv = document.getElementById('sidenav-content');

    this.checkInView();

    const resize = fromEvent(window, 'resize').pipe(auditTime(100)).subscribe(() => this.checkInView());

    this.subscriptions.add(resize);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
