import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { ContentService } from '../../content/content.service';



@Directive({
  selector: '[appViewImage]'
})
export class ViewImageDirective implements OnChanges, AfterViewInit {

  // Variables
  @Input('appViewImage') appViewImage: string;

  // Methods
  public showImage() {

    if (!this.appViewImage) {
      this.element.nativeElement.src = 'image/svg/production/ic_broken_image_48px.svg';
      return;
    }

    const _id = this.appViewImage;

    this.contentService.getFile(_id).subscribe(response => {

      const reader = new FileReader();
      reader.onload = () => {
        this.element.nativeElement.src = reader.result;
      };
      reader.readAsDataURL(response);

      // On server errors
    }, () => this.element.nativeElement.src = 'image/svg/production/ic_broken_image_48px.svg');
  }

  // Lifecycle
  constructor(
    private element: ElementRef,
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
