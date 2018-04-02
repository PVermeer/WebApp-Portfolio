import { NgModule } from '@angular/core';

import {
  MatButtonModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule,
  MatExpansionModule, MatTabsModule, MatCardModule, MatSlideToggleModule, MatProgressBarModule,
  MatFormFieldModule, MatDialogModule, MatInputModule, MatSnackBarModule, MatStepperModule,
  MatMenuModule, MatTableModule, MatCheckboxModule, MatSelectModule,
} from '@angular/material';

// Add here for auto import and adding to NgModule
const matModules = [
  MatButtonModule,
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatExpansionModule,
  MatTabsModule,
  MatCardModule,
  MatSlideToggleModule,
  MatProgressBarModule,
  MatFormFieldModule,
  MatDialogModule,
  MatInputModule,
  MatSnackBarModule,
  MatStepperModule,
  MatMenuModule,
  MatTableModule,
  MatCheckboxModule,
  MatSelectModule,
];

@NgModule({
  imports: matModules,
  exports: matModules
})
export class MaterialModule { }

