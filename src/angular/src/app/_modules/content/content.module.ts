import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../_shared/shared.module';
import { ContentService } from './content.service';
import { ContentManagementComponent } from './content-management/content-management.component';
import { NewPageComponent } from './content-management/new-page/new-page.component';


@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    ContentManagementComponent,
    NewPageComponent,
  ],
  exports: [
    ContentManagementComponent
  ],
  providers: [ContentService],
})
export class ContentModule { }
