import { Injectable } from '@angular/core';

@Injectable()
export class ScrollIntoViewService {

  scrollIntoView(element) {
    const scrollToElement = document.getElementById(element);

    scrollToElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
  }

}
