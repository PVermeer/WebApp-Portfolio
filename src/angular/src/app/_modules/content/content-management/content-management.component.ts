import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContentInfo, ContentPageArrays } from '../../../../../../server/database/models/content/content.types';
import { UserService } from '../../users/user.service';
import { DialogComponent, DialogContent } from '../../_shared/components/dialog/dialog.component';
import { SnackbarComponent } from '../../_shared/components/snackbar/snackbar.component';
import { SharedService } from '../../_shared/services/shared.service';
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

  public isSmaller$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).pipe(
    map(result => result.matches)
  );

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
          this.addTitleField(x.page, i);
          this.addInfoField(x.info, i);
        }
        this.updateInfoField(x.info, i);
        x.info = { ...x.info, ...this.formInfoAttributes() };
        x.info.list.map((item, f) => { this.updateInfoListItemField(item, i, f); });

        x.texts = x.texts.map((y, j) => {
          if (this.initFlag) {
            this.addTextField(y.header, y.text, y.ref, i);
          }
          this.updateTextField(y.header, y.text, y.ref, i, j);
          return { ...y, ...this.formTextsAttributes() };
        });

        x.lists = x.lists.map((b, j) => {
          if (this.initFlag) {
            this.addListField(b.title, b.ref, i);
          }
          this.updateListField(b.title, b.ref, i, j);
          b.list.map((c, d) => { this.updateListItemField(c, i, j, d); });
          return { ...b, ...this.formListAttributes() };
        });

        x.images = x.images.map((z, k) => {
          if (this.initFlag) {
            this.addImageField(z.title, z.image as string, null, z._id as string, z.ref, i);
          }
          this.updateImageField(z.title, z.image as string, null, z._id as string, z.ref, i, k);
          return { ...z, ...this.formImagesAttributes() };
        });

        x.files = x.files.map((a, j) => {
          if (this.initFlag) {
            this.addFileField(a.title, a.file as string, null, a._id as string, a.ref, i);
          }
          this.updateFileField(a.title, a.file as string, null, a._id as string, a.ref, i, j);
          return { ...a, ...this.formFilesAttributes() };
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

  public updateForm(i: number) {

    const value: ContentPageLeanSubmit = this.contentForm[i].getRawValue();
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

    this.progressSpinner = true;
    this.contentService.updateContentPage(formData).subscribe(res => {
      this.progressSpinner = false;

      this.snackbarComponent.snackbarSuccess(res);
      this.getForm();

      // Errors
    }, () => {
      this.progressSpinner = false;
      this.resetContentManager();
    });
  }

  public confirmUpdateForm(i: number) {

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
      if (!response) { return; }

      this.updateForm(i);
    });
  }

  public newPageForm() {

    // Open dialog to create a new page
    const data: DialogContent = { component: NewPageComponent };
    const dialog = this.matDialog.open(DialogComponent, { data });

    dialog.afterClosed().subscribe((page: string) => {

      if (!page) { return; }

      // New page
      const index = this.addFormGroup();
      this.addTitleField(page, index);
      this.addInfoField({ title: 'New title', subtitle: 'New subtitle', text: 'Some text', list: [] }, index);
      this.addInfoListItemField('New list item', index);
      this.addTextField('Header 1', 'Some text', '', index);
      this.addListField('New list', '', index);
      this.addListItemField('New item', index, 0);
      this.addImageField('New image', null, null, null, '', index);
      this.addFileField('New file', null, null, null, '', index);

      this.progressSpinner = true;
      this.contentService.newContentPage(this.contentForm[index].value).subscribe(response => {
        this.progressSpinner = false;

        // Success
        this.snackbarComponent.snackbarSuccess(response);
        this.resetContentManager();

        // Errors
      }, () => {
        this.progressSpinner = false;
        this.resetContentManager();
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
        this.resetContentManager();
      }
      );
    });
  }

  public resetContentManager() {

    this.contentForm = [];
    this.initFlag = true;
    this.getForm();
  }

  // Form buttons
  public infoAddListItem(i: number) {

    this.addInfoListItemField('', i);
    this.pagesResponse[i].info.list.push('');
  }
  public textFieldAdd(i: number) {

    this.addTextField('New header', 'Some text', '', i);
    this.pagesResponse[i].texts.push({
      ...{ header: 'New header', text: 'Some text', ref: '' },
      ...this.formTextsAttributes()
    });
  }
  public listFieldAdd(i: number) {

    this.addListField('New title', '', i);
    const index = this.pagesResponse[i].lists.push({
      ...{ title: 'New title', list: [], ref: '' },
      ...this.formListAttributes()
    }) - 1;
    this.listAddItem(i, index);
  }
  public listAddItem(i: number, j: number) {

    this.addListItemField('', i, j);
    this.pagesResponse[i].lists[j].list.push('');
  }
  public imageFieldAdd(i: number) {

    this.addImageField('New image', null, null, null, '', i);
    this.pagesResponse[i].images.push({
      ...{ _id: null, title: 'New image', image: null, ref: '' },
      ...this.formImagesAttributes()
    });
  }
  public fileFieldAdd(i: number) {

    this.addFileField('New file', null, null, null, '', i);
    this.pagesResponse[i].files.push({
      ...{ _id: null, title: 'New file', file: null, ref: '' },
      ...this.formFilesAttributes()
    });
  }

  public infoRemovelistItem(i: number, n: number) {

    if (this.pagesResponse[i].info.list.length === 1) {
      this.setValueInfoListItemField(i, '');
      this.pagesResponse[i].info.list[0] = '';
    } else {
      this.removeInfoListItemField(i, n);
      this.pagesResponse[i].info.list.splice(n, 1);
    }
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

    if (this.pagesResponse[i].lists[j].list.length === 1) {
      this.setValueListItemField(i, j, '');
      this.pagesResponse[i].lists[j].list[0] = '';
    } else {
      this.removeListItemField(i, j, m);
      this.pagesResponse[i].lists[j].list.splice(j, 1);
    }
  }
  public imageFieldRemove(i: number, j: number) {

    this.removeImageField(i, j);
    this.pagesResponse[i].images.splice(j, 1);
  }
  public fileFieldRemove(i: number, j: number) {

    this.removeFileField(i, j);
    this.pagesResponse[i].files.splice(j, 1);
  }

  public moveItemBack(i: number, control: keyof ContentPageArrays, index: number) {

    if (index === 0) { return; }

    const indexA = index;
    const indexB = index - 1;
    const formControl = <FormArray>this.contentForm[i].controls[control];
    const array = formControl.controls;
    formControl.patchValue(this.sharedService.swapIndexArray(array, indexA, indexB));

    const form = this.pagesResponse[i];
    const array2 = form[control];
    this.sharedService.swapIndexArray(array2, indexA, indexB);
  }
  public moveItemForward(i: number, control: keyof ContentPageArrays, index: number) {

    const indexA = index;
    const indexB = index + 1;
    const formControl = <FormArray>this.contentForm[i].controls[control];
    const array = formControl.controls;

    if (array.length === index + 1) { return; }
    formControl.patchValue(this.sharedService.swapIndexArray(array, indexA, indexB));

    const form = this.pagesResponse[i];
    const array2 = form[control];
    this.sharedService.swapIndexArray(array2, indexA, indexB);
  }

  // Form methods
  private initFormGroup() {
    return this.formBuilder.group({
      info: this.formBuilder.group({}),
      texts: this.formBuilder.array([]),
      lists: this.formBuilder.array([]),
      images: this.formBuilder.array([]),
      files: this.formBuilder.array([]),
    });
  }
  private initInfoField(info: ContentInfo, group: FormGroup) {
    group.addControl('title', new FormControl(info.title));
    group.addControl('subtitle', new FormControl(info.subtitle));
    group.addControl('text', new FormControl(info.text));
    group.addControl('list', new FormArray([]));
  }
  private initTextField(header: string, text: string, ref: string) {
    return this.formBuilder.group({
      header: [header, []],
      text: [text, []],
      ref: [{ value: ref, disabled: !this.isDeveloper }, []],
    });
  }
  private initListField(title: string, ref: string) {
    return this.formBuilder.group({
      title: [title, []],
      list: this.formBuilder.array([]),
      ref: [{ value: ref, disabled: !this.isDeveloper }, []],
    });
  }
  private initListItemField(listItem: string) {
    return this.formBuilder.control(listItem);
  }
  private initImageField(title: string, image: string, imageUpdate: File, _id: string, ref: string) {
    return this.formBuilder.group({
      title: [title, [Validators.required]],
      image: [image, []],
      imageUpdate: [imageUpdate, []],
      _id: [_id, []],
      ref: [{ value: ref, disabled: !this.isDeveloper }, []],
    });
  }
  private initFileField(title: string, file: string, fileUpdate: File, _id: string, ref: string) {
    return this.formBuilder.group({
      title: [title, [Validators.required]],
      file: [file, []],
      fileUpdate: [fileUpdate, []],
      _id: [_id, []],
      ref: [{ value: ref, disabled: !this.isDeveloper }, []],
    });
  }

  public validateImageSize(i: number, k: number, file: File) {

    if (file && file.size > this.maxImageSize) {
      const control = <FormArray>this.contentForm[i].controls['images'];
      control.controls[k].get('imageUpdate').setErrors({ 'Size exceeded': true });
    }
  }
  public validateFileSize(i: number, l: number, file: File) {

    if (file.size > this.maxFileSize) {
      const control = <FormArray>this.contentForm[i].controls['files'];
      control.controls[l].get('fileUpdate').setErrors({ 'Size exceeded': true });
    }
  }

  /**
   * @returns Index of the new FormGroup
   */
  private addFormGroup() {
    this.contentForm.push(this.initFormGroup());
    return this.contentForm.length - 1;
  }
  private addTitleField(page: string, i: number) {
    this.contentForm[i].addControl('page', new FormControl(page));
  }
  private addInfoField(info: ContentInfo, i: number) {
    const group = <FormGroup>this.contentForm[i].controls['info'];
    this.initInfoField(info, group);
  }
  private addTextField(header: string, text: string, ref: string, i: number) {
    const control = <FormArray>this.contentForm[i].controls['texts'];
    control.push(this.initTextField(header, text, ref));
  }
  private addListField(title: string, ref: string, i: number) {
    const control = <FormArray>this.contentForm[i].controls['lists'];
    control.push(this.initListField(title, ref));
  }
  private addListItemField(listItem: string, i: number, j: number) {
    const controlLists = <FormArray>this.contentForm[i].controls['lists'];
    const controlListsItems = <FormGroup>controlLists.controls[j];
    const itemsArray = <FormArray>controlListsItems.controls['list'];
    itemsArray.push(this.initListItemField(listItem));
  }
  private addInfoListItemField(listItem: string, i: number) {
    const group = <FormGroup>this.contentForm[i].controls['info'];
    const itemsArray = <FormArray>group.controls['list'];
    itemsArray.push(this.initListItemField(listItem));
  }
  private addImageField(title: string, image: string, imageUpdate: File, _id: string, ref: string, i: number) {
    const control = <FormArray>this.contentForm[i].controls['images'];
    control.push(this.initImageField(title, image, imageUpdate, _id, ref));
  }
  private addFileField(title: string, file: string, fileUpdate: File, _id: string, ref: string, i: number) {
    const control = <FormArray>this.contentForm[i].controls['files'];
    control.push(this.initFileField(title, file, fileUpdate, _id, ref));
  }

  private updateInfoField(info: ContentInfo, i: number) {
    const group = <FormGroup>this.contentForm[i].controls['info'];
    group.setControl('title', new FormControl(info.title));
    group.setControl('subtitle', new FormControl(info.subtitle));
    group.setControl('text', new FormControl(info.text));
    group.setControl('list', new FormArray([]));
  }
  private updateInfoListItemField(listItem: string, i: number, f: number) {
    const group = <FormGroup>this.contentForm[i].controls['info'];
    const itemsArray = <FormArray>group.controls['list'];
    itemsArray.setControl(f, this.initListItemField(listItem));
  }
  private updateTextField(header: string, text: string, ref: string, i: number, j: number) {
    const control = <FormArray>this.contentForm[i].controls['texts'];
    control.setControl(j, this.initTextField(header, text, ref));
  }
  private updateListField(title: string, ref: string, i: number, j: number) {
    const control = <FormArray>this.contentForm[i].controls['lists'];
    control.setControl(j, this.initListField(title, ref));
  }
  private updateListItemField(listItem: string, i: number, j: number, k: number) {
    const controlLists = <FormArray>this.contentForm[i].controls['lists'];
    const controlListsItems = <FormGroup>controlLists.controls[j];
    const itemsArray = <FormArray>controlListsItems.controls['list'];
    itemsArray.setControl(k, this.initListItemField(listItem));
  }
  private updateImageField(title: string, image: string, imageUpdate: File, _id: string, ref: string, i: number, j: number) {
    const control = <FormArray>this.contentForm[i].controls['images'];
    control.setControl(j, this.initImageField(title, image, imageUpdate, _id as string, ref));
  }
  private updateFileField(title: string, file: string, fileUpdate: File, _id: string, ref: string, i: number, j: number) {
    const control = <FormArray>this.contentForm[i].controls['files'];
    control.setControl(j, this.initFileField(title, file, fileUpdate, _id as string, ref));
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
  private removeInfoListItemField(i: number, n: number) {
    const group = <FormGroup>this.contentForm[i].controls['info'];
    const itemsArray = <FormArray>group.controls['list'];

    if (itemsArray.length === 1) {
      itemsArray.at(0).patchValue('');
    } else {
      itemsArray.removeAt(n);
    }
  }
  private removeImageField(i: number, j: number) {
    const control = <FormArray>this.contentForm[i].controls['images'];
    control.removeAt(j);
  }
  private removeFileField(i: number, j: number) {
    const control = <FormArray>this.contentForm[i].controls['files'];
    control.removeAt(j);
  }

  private setValueInfoListItemField(i: number, value: string) {
    const control = <FormGroup>this.contentForm[i].controls['info'];
    const itemsArray = <FormArray>control.controls['list'];
    itemsArray.at(0).setValue(value);
  }
  private setValueListItemField(i: number, j: number, value: '') {
    const controlLists = <FormArray>this.contentForm[i].controls['lists'];
    const controlListsItems = <FormGroup>controlLists.controls[j];
    const itemsArray = <FormArray>controlListsItems.controls['list'];
    itemsArray.at(0).setValue(value);
  }

  // Form context
  private formInfoAttributes() {
    return {
      placeholderTitle: 'Title',
      typeTitle: 'text',
      alertTitle: '',
      placeholderSubtitle: 'Subtitle',
      typeSubtitle: 'text',
      alertSubtitle: '',
      placeholderText: 'Text',
      typeText: 'text',
      alertText: '',
      placeholderList: 'List item',
      typeList: 'text',
      alertList: '',
    };
  }
  private formTextsAttributes() {
    return {
      placeholderHeader: 'Header',
      typeHeader: 'text',
      alertHeader: '',
      placeholderText: 'Text',
      typeText: 'text',
      alertText: '',
      placeholderRef: 'Reference',
      typeRef: 'text',
      alertRef: '',
    };
  }
  private formListAttributes() {
    return {
      placeholderTitle: 'Title',
      typeTitle: 'text',
      alertTitle: '',
      placeholderItem: 'List item',
      typeItem: 'text',
      alertItem: '',
      placeholderRef: 'Reference',
      typeRef: 'text',
      alertRef: '',
    };
  }
  private formImagesAttributes() {
    return {
      placeholderTitle: 'Title',
      typeTitle: 'text',
      alertTitle: 'Field is required',
      // tslint:disable-next-line:max-line-length
      alertFile: `Maximum image size of ${Math.floor(this.maxImageSize / 1000)} Kb exceeded. Please convert the image to a smaller format or choose another image`,
      placeholderRef: 'Reference',
      typeRef: 'text',
      alertRef: '',
    };
  }
  private formFilesAttributes() {
    return {
      placeholderTitle: 'Title',
      typeTitle: 'text',
      alertTitle: 'Field is required',
      alertFile: `Maximum file size of ${Math.floor(this.maxImageSize / 1024)} Kb exceeded.`,
      placeholderRef: 'Reference',
      typeRef: 'text',
      alertRef: '',
    };
  }

  // Lifecycle
  constructor(
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private contentService: ContentService,
    private snackbarComponent: SnackbarComponent,
    private userService: UserService,
    private sharedService: SharedService,
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
