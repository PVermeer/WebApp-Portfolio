import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../_shared/shared.module';
import { ContentFileDirective } from './content-file.directive';
import { ContentListDirective } from './content-list.directive';
import { ContentManagementComponent } from './content-management/content-management.component';
import { NewPageComponent } from './content-management/new-page/new-page.component';
import { ContentTextDirective } from './content-text.directive';
import { ContentService } from './content.service';

@NgModule({
  imports: [
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    ContentManagementComponent,
    NewPageComponent,
    ContentTextDirective,
    ContentListDirective,
    ContentFileDirective,
  ],
  exports: [
    ContentManagementComponent,
    ContentTextDirective,
    ContentListDirective,
    ContentFileDirective,
  ],
  providers: [ContentService],
})
export class ContentModule { }
