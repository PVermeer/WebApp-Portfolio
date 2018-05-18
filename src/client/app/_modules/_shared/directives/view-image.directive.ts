import { Directive, Input, ElementRef, ChangeDetectorRef, OnChanges, AfterViewInit } from '@angular/core';
import { ContentService } from '../../content/content.service';


@Directive({
  selector: '[appViewImage]'
})
export class ViewImageDirective implements OnChanges, AfterViewInit {

  @Input('appViewImage') appViewImage: string;
  private element: ElementRef;

  public showImage() {

    if (!this.appViewImage) {
      this.element.nativeElement.src = 'image/svg/production/ic_broken_image_48px.svg';
      return;
    }

    const _id = this.appViewImage;

    this.contentService.getImage(_id).subscribe(response => {

      const reader = new FileReader();
      reader.onload = () => {
        this.element.nativeElement.src = reader.result;
      };
      reader.readAsDataURL(response);
    }, () => { }
    );
  }

  constructor(
    element: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    private contentService: ContentService,
  ) {
    this.element = element;
  }

  ngOnChanges() {
    this.showImage();
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

}
