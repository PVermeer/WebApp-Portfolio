import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DialogComponent, DialogContent } from '../../_shared/components/dialog/dialog.component';
import { ContentService } from '../content.service';
import { SnackbarComponent } from '../../_shared/components/snackbar/snackbar.component';
import { Observable } from 'rxjs/Observable';
import { NewPageComponent } from './new-page/new-page.component';
import { ContentPageDocumentExt, ContentPageLeanSubmit, ContentTextExt, ContentImageExt } from './content-management.types.d';


@Component({
  selector: 'app-content-management',
  templateUrl: './content-management.component.html',
  styleUrls: ['./content-management.component.css'],
})
export class ContentManagementComponent {

  // Variables
  public progressBar = false;
  public contentForm: FormGroup[] = [];
  public pages: Observable<ContentPageDocumentExt[]>;
  private pagesResponse: ContentPageDocumentExt[];
  private initFlag = true;

  // Methods
  public async getForm() {

    this.contentService.getAllContentPages().subscribe(async response => {

      // Map new array for form options
      const newArray = await Promise.all(
        response.map((x: ContentPageDocumentExt, i) => new Promise(async resolve => {

          // Basic init
          if (this.initFlag) {
            this.addFormGroup();
            this.addTitleField(x.title, i);
          }

          // Map texts array
          x.texts.map((y, j) => {

            if (this.initFlag) {
              this.addTextField(y.header, y.text, null, i);
            }

            // Text options + data
            this.formText(y);
            this.updateTextField(y.header, y.text, y._id as string, i, j);
          });

          // Map images array, async to get images
          await Promise.all(x.images.map((z, k) => new Promise(resolve2 => {

            if (this.initFlag) {
              this.addImageField(z.title, z.image, null, z._id as string, i);
            }

            // Image options + data
            this.formImages(z);
            this.updateImageField(z.title, z.image, null, z._id as string, i, k);

            // Get image if available
            if (z.image) {
              this.contentService.getImage(z.image as string).subscribe(response2 => {

                z.imageSrc = response2;
                resolve2();

                // Errors
              }, () => this.errorHandler()
              );

            } else { resolve2(); }
          })));

          resolve(x);
        })));

      // Pages as observable along with the FormGroup
      this.pages = Observable.of(newArray as ContentPageDocumentExt[]);
      this.pagesResponse = newArray as ContentPageDocumentExt[];
      this.initFlag = false;

      // Errors
    }, () => { }
    );
  }

  public updateForm(value: ContentPageLeanSubmit): Promise<void> {
    return new Promise((resolve, reject) => {

      // Create formData
      const formData = new FormData;
      value.images.map(x => {
        if (x.imageUpdate) { formData.append('images', x.imageUpdate, x._id as string); }
      });
      formData.append('content', JSON.stringify(value));

      // Send formdata
      this.contentService.updateContentPage(formData).subscribe(resp => {

        // On success
        this.snackbarComponent.snackbarSuccess(resp);
        resolve();

        // Errors
      }, () => { this.errorHandler(); reject(); }
      );
    });
  }

  public confirmUpdateForm(i: number) {

    const value: ContentPageLeanSubmit = this.contentForm[i].value;

    // Open dialog to confirm the changes
    const data: DialogContent = {
      dialogData: {
        title: 'Confirm',
        body: 'Confirm your changes',
        button: 'Confirm',
        button2: 'Cancel'
      }
    };
    const dialog = this.matDialog.open(DialogComponent, { data, disableClose: true });

    dialog.afterClosed().subscribe(async response => {
      // Do nothing on cancel
      if (!response) { return; }

      await this.updateForm(value).catch(() => { this.errorHandler(); return; });
      this.getForm();
    });
  }

  public newPageForm() {

    // Open dialog to create a new page
    const data: DialogContent = { component: NewPageComponent };
    const dialog = this.matDialog.open(DialogComponent, { data });

    dialog.afterClosed().subscribe(title => {

      if (!title) { return; }

      // New page
      const index = this.addFormGroup();
      this.addTitleField(title, index);
      this.addTextField('Header 1', 'Some text', null, index);
      this.addImageField('New image', null, null, null, index);

      this.contentService.newContentPage(this.contentForm[index].value).subscribe(response => {

        // Success
        this.snackbarComponent.snackbarSuccess(response);
        this.getForm();

        // Errors
      }, () => { this.errorHandler(); }
      );
    });
  }

  public removePage(i: number) {

    // Open dialog to remove a new page
    const data: DialogContent = {
      dialogData: {
        title: 'Confirm',
        body: `Do you really want to <b>delete</b> ${this.contentForm[i].value.title}?`,
        button: 'Confirm',
        button2: 'Cancel'
      }
    };
    const dialog = this.matDialog.open(DialogComponent, { data, disableClose: true });

    // Get title and create formGroup
    dialog.afterClosed().subscribe(confirm => {

      if (!confirm) { return; }

      const _id = this.pagesResponse[i]._id;
      this.removeFormGroup(i);

      this.contentService.deleteContentPage(_id as string).subscribe(response => {

        // Success
        this.snackbarComponent.snackbarSuccess(response);
        this.getForm();

        // Errors
      }, () => { this.errorHandler(); }
      );
    });
  }

  // Form buttons
  public async textFieldAdd(i: number) {

    this.addTextField('New header', 'Some text', null, i);
    await this.updateForm(this.contentForm[i].value).catch(() => { this.errorHandler(); return; });
    this.getForm();
  }

  public async imageFieldAdd(i: number) {

    this.addImageField('New image', null, null, null, i);
    await this.updateForm(this.contentForm[i].value).catch(() => { this.errorHandler(); return; });
    this.getForm();
  }

  public async textFieldRemove(i: number, j: number) {

    this.removeTextField(i, j);
    await this.updateForm(this.contentForm[i].value).catch(() => { this.errorHandler(); return; });
    this.getForm();
  }

  public async imageFieldRemove(i: number, j: number) {

    this.removeImageField(i, j);
    await this.updateForm(this.contentForm[i].value).catch(() => { this.errorHandler(); return; });
    this.getForm();
  }

  public errorHandler() {

    this.contentForm = [];
    this.initFlag = true;
    this.getForm();
  }

  constructor(
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private contentService: ContentService,
    private snackbarComponent: SnackbarComponent,
  ) {
    this.getForm();
  }

  // Form methods
  private initFormGroup() {
    return this.formBuilder.group({
      texts: this.formBuilder.array([]),
      images: this.formBuilder.array([]),
    });
  }
  private initTextField(header: string, text: string, _id: string) {
    return this.formBuilder.group({
      header: [header, []],
      text: [text, []],
      _id: [_id, []],
    });
  }
  private initImageField(title: string, image: any, imageUpdate: File, _id: string) {
    return this.formBuilder.group({
      title: [title, []],
      image: [image, []],
      imageUpdate: [imageUpdate, []],
      _id: [_id, []],
    });
  }

  /** @returns Index of the new FormGroup */
  private addFormGroup() {
    this.contentForm.push(this.initFormGroup());
    return this.contentForm.length - 1;
  }
  private addTitleField(title: string, i: number) {
    this.contentForm[i].addControl('title', new FormControl(title));
  }
  private addTextField(header: string, text: string, _id: string, i: number) {
    const control = <FormArray>this.contentForm[i].controls['texts'];
    control.push(this.initTextField(header, text, _id));
  }
  private addImageField(title: string, image: any, imageUpdate: File, _id: string, i: number) {
    const control = <FormArray>this.contentForm[i].controls['images'];
    control.push(this.initImageField(title, image, imageUpdate, _id));
  }

  private updateTextField(header: string, text: string, _id: string, i: number, j: number) {
    const control = <FormArray>this.contentForm[i].controls['texts'];
    control.setControl(j, this.initTextField(header, text, _id as string));
  }
  private updateImageField(title: string, image: any, imageUpdate: File, _id: string, i: number, j: number) {
    const control = <FormArray>this.contentForm[i].controls['images'];
    control.setControl(j, this.initImageField(title, image, imageUpdate, _id as string));
  }

  private removeFormGroup(i: number) {
    this.contentForm.splice(i, 1);
  }
  private removeTextField(i: number, j: number) {
    const control = <FormArray>this.contentForm[i].controls['texts'];
    control.removeAt(j);
  }
  private removeImageField(i: number, j: number) {
    const control = <FormArray>this.contentForm[i].controls['images'];
    control.removeAt(j);
  }

  // Form context
  private formText(y: ContentTextExt) {
    y.placeholderHeader = 'Edit the header here';
    y.typeHeader = 'text';
    y.alertHeader = '';
    y.placeholderText = 'Edit the text here';
    y.typeText = 'text';
    y.alertText = '';
  }
  private formImages(z: ContentImageExt) {
    z.placeholderTitle = 'Edit the title here';
    z.typeTitle = 'text';
    z.alertTitle = '';
  }

}
