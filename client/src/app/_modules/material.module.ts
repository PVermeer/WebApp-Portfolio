import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material';

// Add here for auto import and adding to NgModule
const matModules = [
  MatButtonModule
];

@NgModule({
  imports: matModules,
  exports: matModules
})
export class MaterialModule { }

