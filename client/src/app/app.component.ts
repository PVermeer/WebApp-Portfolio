import { Component } from '@angular/core';
import { SidenavService } from './_services/sidenav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SidenavService],
})
export class AppComponent {

  public secondaryTheme: boolean;

  constructor(
    private sidenavService: SidenavService,
  ) {
    sidenavService.themeToggle$.subscribe((themeToggle) => {
        this.secondaryTheme = themeToggle;
    });
  }

}
