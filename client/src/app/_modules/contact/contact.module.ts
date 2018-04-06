import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../_shared/shared.module';

import { MailService } from '../_shared/mail.service';
import { ContactComponent } from './contact.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { ContactDialogComponent } from './contact-form/contact-dialog/contact-dialog.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [
    ContactComponent,
    ContactFormComponent,
    ContactDialogComponent,
    ContactDetailsComponent,
  ],
  providers: [MailService]
})
export class ContactModule { }
