import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fa-icon',
  template: `
    <i class="{{ prefix }} fa-{{ iconToShow }}" [ngStyle]="addStyles" aria-hidden="true"></i>
    `,
  styles: [``]
})
export class FaIconComponent implements OnInit {

  public addClasses = '';
  public addStyles: {};
  public prefix: string;
  public iconToShow: string;

  @Input() icon: string;
  @Input() size?: string;

  private showIcon() {
    if (!this.icon) { return; }

    const array = this.icon.split(' ');
    if (array[0] === '') { array.shift(); }
    this.prefix = array[0];
    this.iconToShow = array[1];

    if (this.size) {
      this.addStyles = { 'font-size': this.size };
    }
  }

  ngOnInit() {
    this.showIcon();
  }

}
