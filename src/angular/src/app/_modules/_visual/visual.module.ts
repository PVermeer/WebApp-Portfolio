import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FaIconComponent } from './fa-icon/fa-icon.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FaIconComponent
  ],
  exports: [
    FaIconComponent,
  ]
})
export class VisualModule { }
