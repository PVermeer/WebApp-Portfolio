import { Injectable } from '@angular/core';

@Injectable()
export class CssAnimateInviewService {

  /**
   * Used to animate elements into the view on scroll.
   * Add the class .in-view.
   * Use the attribute in-view="css-class" to provide the to be added class name of the animation.
   * Animation classes are provided by the animate.css package.
   * https://daneden.github.io/animate.css/
  */
  public elementInView(): void {
    const elements = document.querySelectorAll('[in-view]');
    [].forEach.call(elements, (element: HTMLElement) => {

      if (!element.classList.contains('animated')) { element.classList.add('hide'); }

      // Element variables
      const animation = element.getAttribute('in-view');
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
    });
  }
}
