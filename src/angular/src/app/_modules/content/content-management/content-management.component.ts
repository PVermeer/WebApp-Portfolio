import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Observable, Subscription, of } from 'rxjs';
import { DialogComponent, DialogContent } from '../../_shared/components/dialog/dialog.component';
import { SnackbarComponent } from '../../_shared/components/snackbar/snackbar.component';
import { UserService } from '../../users/user.service';
import { ContentService } from '../content.service';
import { ContentPageDocumentExt, ContentPageLeanSubmit } from './content-management.types.d';
import { NewPageComponent } from './new-page/new-page.component';

@Component({
  selector: 'app-content-management',
  templateUrl: './content-management.component.html',
  styleUrls: ['./content-management.component.css'],
})
export class ContentManagementComponent implements OnInit, OnDestroy {

  // Variables
  public progressSpinner = false;
  public contentForm: FormGroup[] = [];
  public pages: Observable<ContentPageDocumentExt[]>;
  private pagesResponse: ContentPageDocumentExt[];
  private initFlag = true;
  private maxImageSize = 204800; // Bytes
  private maxFileSize = 2097152; // Bytes
  public isDeveloper = false;

  // Subscriptions
  private subscriptions = new Subscription;

  // Methods
  public getForm() {

    this.progressSpinner = true;
    this.contentService.getAllContentPages().subscribe(response => {
      this.progressSpinner = false;

      // Map new array for form options
      const newArray = response.map((x: ContentPageDocumentExt, i) => {
        if (this.initFlag) {
          this.addFormGroup();
          this.addTitleField(x.title, i);
        }

        x.texts.map((y, j) => {
          if (this.initFlag) {
            this.addTextField(y.header, y.text, null, i);
          }
          this.updateTextField(y.header, y.text, y._id as string, i, j);
          y = { ...y, ...this.formTextsAttributes() };
        });

        x.lists.map((b, j) => {
          if (this.initFlag) {
            this.addListField(b.header, null, i);
          }
          this.updateListField(b.header, b._id as string, i, j);
          b.list.map((c, d) => { this.updateListItemField(c, i, j, d); });
          b = { ...b, ...this.formListAttributes() };
        });

        x.images.map((z, k) => {
          if (this.initFlag) {
            this.addImageField(z.title, z.image, null, z._id as string, i);
          }
          this.updateImageField(z.title, z.image, null, z._id as string, i, k);
          z = { ...z, ...this.formImagesAttributes() };
        });

        // Map files array
        x.files.map((a, j) => {
          if (this.initFlag) {
            this.addFileField(a.title, a.file, null, a._id as string, i);
          }
          this.updateFileField(a.title, a.file, null, a._id as string, i, j);
          a = { ...a, ...this.formFilesAttributes() };
        });

        return x;
      });

      // Pages as observable along with the FormGroup
      this.pages = of(newArray);
      this.pagesResponse = newArray;
      this.initFlag = false;

      // On server errors
    }, () => {
      this.progressSpinner = false;
    } // Avoid loop
    );
  }

  public updateForm(value: ContentPageLeanSubmit): Promise<void> {
    return new Promise(resolve => {

      const formData = new FormData;

      value.images.map(x => {
        if (x.imageUpdate) {
          const id = <string>x._id || 'newId-' + x.title + '-' + Math.random().toString(36).slice(-10);

          formData.append('images', x.imageUpdate, id);
          x._id = id;
        }
      });
      value.files.map(x => {
        if (x.fileUpdate) {
          const id = <string>x._id || 'newId-' + x.title + '-' + Math.random().toString(36).slice(-10);

          formData.append('files', x.fileUpdate, id);
          x._id = id;
        }
      });
      formData.append('content', JSON.stringify(value));

      // Send formdata
      this.progressSpinner = true;
      this.contentService.updateContentPage(formData).subscribe(res => {
        this.progressSpinner = false;

        // On success
        this.snackbarComponent.snackbarSuccess(res);
        resolve();

        // Errors
      }, () => {
        this.progressSpinner = false;
        this.errorHandler(); resolve();
      });
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
      this.addFileField('New file', null, null, null, index);

      this.progressSpinner = true;
      this.contentService.newContentPage(this.contentForm[index].value).subscribe(response => {
        this.progressSpinner = false;

        // Success
        this.snackbarComponent.snackbarSuccess(response);
        this.getForm();

        // Errors
      }, () => {
        this.progressSpinner = false;
        this.errorHandler();
      }
      );
    });
  }

  public removePage(i: number) {

    // Open dialog to remove a new page
    const data: DialogContent = {
      dialogData: {
        title: 'Confirm',
        body: `Do you really want to <b>delete</b> ${this.contentForm[i].value.title}?
                <br><br>
               Submit your changes first, this will delete unsaved changes`,
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

      this.progressSpinner = true;
      this.contentService.deleteContentPage(_id as string).subscribe(response => {
        this.progressSpinner = false;


        // Success
        this.snackbarComponent.snackbarSuccess(response);
        this.getForm();

        // Errors
      }, () => {
        this.progressSpinner = false;
        this.errorHandler();
      }
      );
    });
  }

  // Form buttons
  public textFieldAdd(i: number) {

    this.addTextField('New header', 'Some text', null, i);
    this.pagesResponse[i].texts.push({
      ...{ _id: null, header: 'New header', text: 'Some text' },
      ...this.formTextsAttributes()
    });
  }
  public listFieldAdd(i: number) {

    this.addListField('New header', null, i);
    const index = this.pagesResponse[i].lists.push({
      ...{ _id: null, header: 'New header', list: [] },
      ...this.formListAttributes()
    }) - 1;
    this.listAddItem(i, index);
  }
  public listAddItem(i: number, j: number) {

    this.addListItemField('', i, j);
    this.pagesResponse[i].lists[j].list.push('');
  }
  public imageFieldAdd(i: number) {

    this.addImageField('New image', null, null, null, i);
    this.pagesResponse[i].images.push({
      ...{ _id: null, title: 'New image', image: null },
      ...this.formImagesAttributes()
    });
  }
  public fileFieldAdd(i: number) {

    this.addFileField('New file', null, null, null, i);
    this.pagesResponse[i].files.push({
      ...{ _id: null, title: 'New file', file: null },
      ...this.formFilesAttributes()
    });
  }

  public textFieldRemove(i: number, j: number) {

    this.removeTextField(i, j);
    this.pagesResponse[i].texts.splice(j, 1);
  }
  public listFieldRemove(i: number, j: number) {

    this.removeListField(i, j);
    this.pagesResponse[i].lists.splice(j, 1);
  }
  public listRemoveItem(i: number, j: number, m: number) {

    if (this.pagesResponse[i].lists[j].list.length === 1) { return this.listFieldRemove(i, j); }

    this.removeListItemField(i, j, m);
    this.pagesResponse[i].lists[j].list.splice(j, 1);
  }
  public imageFieldRemove(i: number, j: number) {

    this.removeImageField(i, j);
    this.pagesResponse[i].images.splice(j, 1);
  }
  public fileFieldRemove(i: number, j: number) {

    this.removeFileField(i, j);
    this.pagesResponse[i].files.splice(j, 1);
  }

  public errorHandler() {

    this.contentForm = [];
    this.initFlag = true;
    this.getForm();
  }

  // Form methods
  private initFormGroup() {
    return this.formBuilder.group({
      texts: this.formBuilder.array([]),
      lists: this.formBuilder.array([]),
      images: this.formBuilder.array([]),
      files: this.formBuilder.array([]),
    });
  }
  private initTextField(header: string, text: string, _id: string) {
    return this.formBuilder.group({
      header: [{ value: header, disabled: !this.isDeveloper }, []],
      text: [text, []],
      _id: [_id, []],
    });
  }
  private initListField(header: string, _id: string) {
    return this.formBuilder.group({
      header: [{ value: header, disabled: !this.isDeveloper }, []],
      list: this.formBuilder.array([]),
      _id: [_id, []],
    });
  }
  private initListItemField(listItem: string) {
    return this.formBuilder.control(listItem);
  }
  private initImageField(title: string, image: any, imageUpdate: File, _id: string) {
    return this.formBuilder.group({
      title: [{ value: title, disabled: !this.isDeveloper }, []],
      image: [image, []],
      imageUpdate: [imageUpdate, []],
      _id: [_id, []],
    });
  }
  private initFileField(title: string, file: any, fileUpdate: File, _id: string) {
    return this.formBuilder.group({
      title: [{ value: title, disabled: !this.isDeveloper }, []],
      file: [file, []],
      fileUpdate: [fileUpdate, []],
      _id: [_id, []],
    });
  }

  public validateImageSize(i: number, k: number, file: File) {

    if (file.size > this.maxImageSize) {
      const control = <FormArray>this.contentForm[i].controls['images'];
      control.controls[k].get('imageUpdate').setErrors({ 'Size exceeded': true });
    }
  }
  public validateFileSize(i: number, l: number, file: File) {

    if (file.size > this.maxFileSize) {
      const control = <FormArray>this.contentForm[i].controls['files'];
      console.log(control);
      control.controls[l].get('fileUpdate').setErrors({ 'Size exceeded': true });
      console.log(control.controls[l]);
    }
  }

  /**
   * @returns Index of the new FormGroup
   */
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
  private addListField(header: string, _id: string, i: number) {
    const control = <FormArray>this.contentForm[i].controls['lists'];
    control.push(this.initListField(header, _id));
  }
  private addListItemField(listItem: string, i: number, j: number) {
    const controlLists = <FormArray>this.contentForm[i].controls['lists'];
    const controlListsItems = <FormGroup>controlLists.controls[j];
    const itemsArray = <FormArray>controlListsItems.controls['list'];
    itemsArray.push(this.initListItemField(listItem));
  }
  private addImageField(title: string, image: any, imageUpdate: File, _id: string, i: number) {
    const control = <FormArray>this.contentForm[i].controls['images'];
    control.push(this.initImageField(title, image, imageUpdate, _id));
  }
  private addFileField(title: string, file: any, fileUpdate: File, _id: string, i: number) {
    const control = <FormArray>this.contentForm[i].controls['files'];
    control.push(this.initFileField(title, file, fileUpdate, _id));
  }

  private updateTextField(header: string, text: string, _id: string, i: number, j: number) {
    const control = <FormArray>this.contentForm[i].controls['texts'];
    control.setControl(j, this.initTextField(header, text, _id as string));
  }
  private updateListField(header: string, _id: string, i: number, j: number) {
    const control = <FormArray>this.contentForm[i].controls['lists'];
    control.setControl(j, this.initListField(header, _id as string));
  }
  private updateListItemField(listItem: string, i: number, j: number, k: number) {
    const controlLists = <FormArray>this.contentForm[i].controls['lists'];
    const controlListsItems = <FormGroup>controlLists.controls[j];
    const itemsArray = <FormArray>controlListsItems.controls['list'];
    itemsArray.setControl(k, this.initListItemField(listItem));
  }
  private updateImageField(title: string, image: any, imageUpdate: File, _id: string, i: number, j: number) {
    const control = <FormArray>this.contentForm[i].controls['images'];
    control.setControl(j, this.initImageField(title, image, imageUpdate, _id as string));
  }
  private updateFileField(title: string, file: any, fileUpdate: File, _id: string, i: number, j: number) {
    const control = <FormArray>this.contentForm[i].controls['files'];
    control.setControl(j, this.initFileField(title, file, fileUpdate, _id as string));
  }

  private removeFormGroup(i: number) {
    this.contentForm.splice(i, 1);
  }
  private removeTextField(i: number, j: number) {
    const control = <FormArray>this.contentForm[i].controls['texts'];
    control.removeAt(j);
  }
  private removeListField(i: number, j: number) {
    const control = <FormArray>this.contentForm[i].controls['lists'];
    control.removeAt(j);
  }
  private removeListItemField(i: number, j: number, m: number) {
    const controlLists = <FormArray>this.contentForm[i].controls['lists'];
    const controlListsItems = <FormGroup>controlLists.controls[j];
    const itemsArray = <FormArray>controlListsItems.controls['list'];
    itemsArray.removeAt(m);
  }
  private removeImageField(i: number, j: number) {
    const control = <FormArray>this.contentForm[i].controls['images'];
    control.removeAt(j);
  }
  private removeFileField(i: number, j: number) {
    const control = <FormArray>this.contentForm[i].controls['files'];
    control.removeAt(j);
  }

  // Form context
  private formTextsAttributes() {
    return {
      typeHeader: 'text',
      alertHeader: '',
      placeholderText: 'Edit the text here',
      typeText: 'text',
      alertText: '',
    };
  }
  private formListAttributes() {
    return {
      typeHeader: 'text',
      alertHeader: '',
      placeholderText: 'Edit the text here',
      typeText: 'text',
      alertText: '',
    };
  }
  private formImagesAttributes() {
    return {
      typeTitle: 'text',
      // tslint:disable-next-line:max-line-length
      alert: `Maximum image size of ${Math.floor(this.maxImageSize / 1000)} Kb exceeded. Please convert the image to a smaller format or choose another image`,
    };
  }
  private formFilesAttributes() {
    return {
      typeTitle: 'text',
      alert: `Maximum file size of ${Math.floor(this.maxImageSize / 1024)} Kb exceeded.`,
    };
  }

  // Lifecycle
  constructor(
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private contentService: ContentService,
    private snackbarComponent: SnackbarComponent,
    private userService: UserService,
  ) {
    this.getForm();
  }

  ngOnInit() {
    const getUserType = this.userService.userType$.subscribe(type => {
      if (type.value === 'developer') { this.isDeveloper = true; }
    });
    this.subscriptions.add(getUserType);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
