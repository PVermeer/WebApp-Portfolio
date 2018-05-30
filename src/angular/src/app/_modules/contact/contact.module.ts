import { NgModule } from '@angular/core';
import { SharedModule } from '../_shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import { ContactFormComponent } from './contact-form/contact-form.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
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
