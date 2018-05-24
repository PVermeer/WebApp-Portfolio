import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

@Directive({
  selector: '[appPagePathHighlight]'
})
export class PagePathHighlightDirective implements AfterViewInit, OnDestroy {

  // Variables
  @Input('appPagePathHighlight') appPagePathHighlight: string; // Path

  // Subscriptions
  private scrollEvents: Subscription;

  // Methods
  public elementInView(): void {

    if (!this.appPagePathHighlight) { return; }

    const linkElement = this.element.nativeElement;
    const getElement = document.getElementById(this.appPagePathHighlight);

    if (!getElement) { return; }

    const element = getElement.getBoundingClientRect();

    // Element variables
    const scrollDiv = document.getElementById('sidenav-content');
    const scrollDivHeight = scrollDiv.offsetHeight;
    const elementTop = element.top - 64; // Toolbar height // TODO Dynamic height
    const elementBottom = elementTop + element.height;

    // Check if out of view
    if (elementTop < 0 || elementBottom > scrollDivHeight / 3) {
      linkElement.classList.remove('active-link');
    } else {

      // Check if in view
      if (elementTop < (scrollDivHeight / 3)) {
        linkElement.classList.add('active-link');
      }
    }
  }

  // Lifecycle
  constructor(
    private element: ElementRef,
  ) { }

  ngAfterViewInit() {
    this.scrollEvents = fromEvent(document.getElementById('sidenav-content'), 'scroll').subscribe(() => {
      this.elementInView();
    });
    // Run once
    this.elementInView();
  }
  ngOnDestroy() {
    this.scrollEvents.unsubscribe();
  }

}
