import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { ContentPageDocumentLean } from '../../../../../../server/database/models/content/content.types';

@Component({
  selector: 'app-social-icons',
  templateUrl: './social-icons.component.html',
  styleUrls: ['./social-icons.component.css']
})
export class SocialIconsComponent implements OnInit, OnChanges, AfterViewInit {

  public addClasses = '';
  public addStyles: {};

  @Input() page: ContentPageDocumentLean;
  @Input() ref: string;
  @Input() animation?: 'ring';
  @Input() size?: string;

  private showIcons() {
    if (!this.page) { return; }

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
