import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../_shared/shared.module';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { TimelineComponent } from './timeline/timeline.component';
import { WaveComponent } from './wave/wave.component';
import { SocialIconsComponent } from './social-icons/social-icons.component';
import { ContentModule } from '../content/content.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ContentModule,
  ],
  exports: [
    ProgressBarComponent,
    TimelineComponent,
    WaveComponent,
    SocialIconsComponent,
  ],
  declarations: [
    ProgressBarComponent,
    TimelineComponent,
    WaveComponent,
    SocialIconsComponent
  ]
})
export class VisualModule { }
