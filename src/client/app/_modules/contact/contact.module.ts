import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../_shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import { MailService } from '../_shared/mail.service';
import { ContactComponent } from './contact.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ContactComponent,
    ContactFormComponent,
    ContactDetailsComponent,
  ],
  providers: [MailService]
})
export class ContactModule { }
