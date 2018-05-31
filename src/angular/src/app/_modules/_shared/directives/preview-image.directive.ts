import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appPreviewImage]'
})
export class PreviewImageDirective implements OnChanges, AfterViewInit {

  @Input('appPreviewImage') appPreviewImage: Blob & FileList;

  public showPreviewImage() {

    const element = this.elementRef.nativeElement;
    if (!this.appPreviewImage || this.appPreviewImage.length === 0) { return; }

    let file: Blob | File;
    if (this.appPreviewImage instanceof FileList) { file = this.appPreviewImage[0]; }
    if (this.appPreviewImage instanceof Blob) { file = this.appPreviewImage; }

    const reader = new FileReader();
    reader.onload = () => element.src = reader.result;
    reader.readAsDataURL(file);
  }

  // Life cycle
  constructor(
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnChanges() {
    this.showPreviewImage();
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

}
