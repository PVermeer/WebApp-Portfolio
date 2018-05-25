import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { ContentService } from '../../content/content.service';

@Directive({
  selector: '[appViewImage]'
})
export class ViewImageDirective implements OnChanges, AfterViewInit {

  @Input('appViewImage') appViewImage: string;

  public showImage() {

    const element = this.elementRef.nativeElement;

    if (!this.appViewImage) {
      element.src = 'image/svg/production/ic_broken_image_48px.svg';
      return;
    }
    const _id = this.appViewImage;

    this.contentService.getFile(_id).subscribe(response => {

      const reader = new FileReader();
      reader.onload = () => element.src = reader.result;
      reader.readAsDataURL(response);

      // On errors
    }, () => element.src = 'image/svg/production/ic_broken_image_48px.svg');
  }

  // Lifecycle
  constructor(
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    private contentService: ContentService,
  ) { }

  ngOnChanges() {
    this.showImage();
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

}
