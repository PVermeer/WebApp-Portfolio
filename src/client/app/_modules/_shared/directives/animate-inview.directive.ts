import { Directive, Input, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

/**
 * Used to animate elements into the view on scroll.
 * Add the directive with the to be added animation class.
 * Animation classes are provided by the animate.css package.
 * https://daneden.github.io/animate.css/
*/
@Directive({
  selector: '[appAnimateInview]'
})
export class AnimateInviewDirective implements AfterViewInit, OnDestroy {

  @Input('appAnimateInview') appAnimateInview: string;
  private scrollEvents: Subscription;

  public elementInView(): void {

    const element = this.element.nativeElement;

    if (!element.classList.contains('animated')) { element.classList.add('hide'); }

    // Element variables
    const animation = this.appAnimateInview;
    const scrollDiv = document.getElementById('sidenav-content');
    const scrollDivBottom = scrollDiv.scrollTop + scrollDiv.offsetHeight;
    const scrollDivHeight = scrollDiv.offsetHeight;
    const elementHeight = element.offsetHeight;
    const elementBottom = element.offsetTop + elementHeight;

    // Check if out of view
    if (element.classList.contains('animated')) {
      if (!(elementBottom - elementHeight < scrollDivBottom && scrollDivBottom - scrollDivHeight < elementBottom + elementHeight)) {
        element.classList.remove('animated');
        element.classList.remove(animation);
        element.classList.add('hide');
      }
    } else {

      // Check if in view
      if (!element.classList.contains('animated')) {
        if (elementBottom < scrollDivBottom && scrollDivBottom - scrollDivHeight < elementBottom + elementHeight) {
          element.classList.add('animated');
          element.classList.add(animation);
          element.classList.remove('hide');
        }
      }
    }
  }

  constructor(
    public element: ElementRef,
  ) { }

  ngAfterViewInit() {
    this.scrollEvents = fromEvent(document.getElementById('sidenav-content'), 'scroll').subscribe(() => {
      this.elementInView();
    });
    // Run the animation service once
    this.elementInView();
  }
  ngOnDestroy() {
    this.scrollEvents.unsubscribe();
  }

}
