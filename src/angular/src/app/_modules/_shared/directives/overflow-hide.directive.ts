import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { auditTime } from 'rxjs/operators';

@Directive({
  selector: '[appOverflowHide]',
  exportAs: 'inView'
})
export class OverflowHideDirective implements AfterViewInit, OnDestroy {

  private contentDiv: HTMLElement;
  private subscriptions = new Subscription;

  private isInView = new Subject<boolean>();
  public isInView$ = this.isInView.asObservable();

  private checkInView() {

    const element: HTMLElement = this.elementRef.nativeElement;
    const elementRec: ClientRect = element.getBoundingClientRect();
    const contentDivRec: ClientRect = this.contentDiv.getBoundingClientRect();

    const elementRight = elementRec.right;
    const contentDivWidth = contentDivRec.width;

    if (elementRight > 0 && elementRight < contentDivWidth) {
      element.classList.remove('hide');
      this.isInView.next(true);
    } else {
      element.classList.add('hide');
      this.isInView.next(false);
    }
  }

  // Life cycle
  constructor(
    private elementRef: ElementRef,
  ) {
  }

  ngAfterViewInit() {
    this.contentDiv = document.body;

    this.checkInView();

    const resize = fromEvent(window, 'resize').pipe(auditTime(100)).subscribe(() => this.checkInView());

    this.subscriptions.add(resize);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
