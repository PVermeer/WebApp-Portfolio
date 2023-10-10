import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LayoutComponent } from './layout/layout.component';
import { SvgService } from './svg.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, MatIconModule, LayoutComponent],
})
export class AppComponent {
  constructor(svg: SvgService) {
    svg.loadSvgIcons();
  }
}
