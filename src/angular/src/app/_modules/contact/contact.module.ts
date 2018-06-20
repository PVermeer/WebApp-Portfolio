import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../_shared/shared.module';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { VisualModule } from '../_visual/visual.module';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    VisualModule,
  ],
  declarations: [
    ContactFormComponent,
    ContactDetailsComponent,
  ],
  exports: [
    ContactFormComponent,
    ContactDetailsComponent,
  ],
  providers: []
})
export class ContactModule { }
