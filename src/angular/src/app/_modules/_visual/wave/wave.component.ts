import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-wave',
  template: `
  <svg width="100%" viewBox="0 0 1000 200" style="height: 50px" preserveAspectRatio="none" [class.flip-svg]="flip">
    <path class="wave" d="M0,50 C500,300 350,-130 1000,150 L1000,00 L0,0 Z"></path>
  </svg>
`,
  styles: [`
  .flip-svg {
  transform: scaleY(-1);
    position: relative;
    bottom: -5px;
  }
  `]
})
export class WaveComponent {

  @Input('flip') flip: boolean;

}
