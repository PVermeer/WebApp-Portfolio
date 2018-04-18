import { Injectable } from '@angular/core';

@Injectable()
export class CssAnimateInviewService {

  /**
   * Used to animate elements into the view on scroll.
   * Add the class .in-view.
   * Use the attribute in-view="css-class" to provide the to be added class name of the animation.
   * Animation classes are provided by the animate.css package.
  */
  public elementInView() {
    const elements = document.querySelectorAll('[in-view]');
    [].forEach.call(elements, (element: HTMLElement) => {

      // Variables
      const scrollDiv = document.getElementById('sidenav-content');
      const animation = element.getAttribute('in-view');
      const scrollDivBottom = scrollDiv.scrollTop + scrollDiv.offsetHeight;
      const scrollDivHeight = scrollDiv.offsetHeight;
      const elementHeight = element.offsetHeight;
      const elementBottom = element.offsetTop + elementHeight;

      // Add .hide class to element
      if (element.className.indexOf('animated') < 0 ) {
        element.classList.add('hide');
      }
       // Check if in view
      if (
        elementBottom < scrollDivBottom
        && scrollDivBottom - scrollDivHeight < elementBottom
      ) {
        // animate.css package
        element.classList.add('animated');
        // css animation from in-view attribute
        element.classList.add(animation);
        // remove the .hide class.
        element.classList.remove('hide');
      }
      // Add (new function) remove class out of view e.g.:
      // else {
      //   element.classList.remove(animation);
      // }
    });
  }

}
