import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public static Title = 'Portfolio';

  public title = AppService.Title;
}
