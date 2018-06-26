import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  template: `
  <div class="progress-container">
    <div [style.width.%]="progress" class="progress-bar">
      <div appAnimateInview="progress-animate" class="progress" [ngClass]="{'primary': color === 'primary', 'accent': color === 'accent'}">
        {{ progress + ' %' }}
      </div>
    </div>
  </div>
`,
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent {

  @Input('progress') progress: number;
  @Input('color') color: 'primary'|'accent';

}
