import { Directive, ElementRef, OnChanges, Input, ChangeDetectorRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appPreviewImage]'
})
export class PreviewImageDirective implements OnChanges, AfterViewInit {

  @Input('appPreviewImage') appPreviewImage: Blob & FileList;
  private element: any;

  public showPreviewImage() {

    if (!this.appPreviewImage || this.appPreviewImage.length === 0) { return; }

    let file: Blob | File;
    if (this.appPreviewImage instanceof FileList) { file = this.appPreviewImage[0]; }
    if (this.appPreviewImage instanceof Blob) { file = this.appPreviewImage; }

    const reader = new FileReader();

    reader.onload = () => {
      this.element.nativeElement.src = reader.result;
    };

    reader.readAsDataURL(file);
  }

  constructor(
    element: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.element = element;
  }

  ngOnChanges() {
    this.showPreviewImage();
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

}
