import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../_shared/shared.module';
import { ContentManagementComponent } from './content-management/content-management.component';
import { NewPageComponent } from './content-management/new-page/new-page.component';
import { ContentService } from './content.service';
import { VisualModule } from '../_visual/visual.module';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    VisualModule
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
