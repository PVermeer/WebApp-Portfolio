import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fa-icon',
  template: `
    <i class="{{ prefix }} fa-{{ iconToShow }} icon-font" [ngStyle]="addStyles" [ngClass]="addClasses" aria-hidden="true"></i>
    `,
  styles: [`
  @keyframes ring {
    0% {
      transform: rotate(0deg);
    }
    33% {
      transform: rotate(-10deg);
    }
    66% {
      transform: rotate(10deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  .ring:hover {
    animation: ring 0.2s 1;
  }
  `]
})
export class FaIconComponent implements OnInit {

  public addClasses: string[];
  public addStyles: {};
  public prefix: string;
  public iconToShow: string;

  @Input() icon: string;
  @Input() size?: string;
  @Input() animation?: 'ring';

  private showIcon() {
    if (!this.icon) { return; }

    const array = this.icon.split(' ');
    if (array[0] === '') { array.shift(); }
    this.prefix = array[0];
    this.iconToShow = array[1];

    if (this.size) {
      this.addStyles = { 'font-size': this.size };
    }
    if (this.animation) {
      this.addClasses = [this.animation];
    }
  }

  ngOnInit() {
    this.showIcon();
  }

}
