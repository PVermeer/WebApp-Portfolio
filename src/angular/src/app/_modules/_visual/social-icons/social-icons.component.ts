import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-social-icons',
  templateUrl: './social-icons.component.html',
  styleUrls: ['./social-icons.component.css']
})
export class SocialIconsComponent implements OnInit, OnChanges, AfterViewInit {

  public addClasses = '';
  public addStyles: {};

  @Input() icons: string[][];
  @Input() animation?: 'ring';
  @Input() size?: string;

  private showIcons() {
    if (!this.icons) { return; }

    if (this.animation) {
      if (this.animation === 'ring') { this.addClasses = this.addClasses + ' ring'; }
    }
    if (this.size) {
      this.addStyles = { 'font-size': this.size };
    }
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.showIcons();
  }

  ngOnChanges() {
    this.showIcons();
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

}
