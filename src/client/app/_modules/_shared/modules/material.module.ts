import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDialogModule, MatDividerModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatStepperModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule } from '@angular/material';

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
  MatPaginatorModule,
  MatSortModule,
  MatChipsModule,
  MatTooltipModule,
  MatDividerModule,
  MatProgressSpinnerModule
];

@NgModule({
  imports: matModules,
  exports: matModules
})
export class MaterialModule { }

