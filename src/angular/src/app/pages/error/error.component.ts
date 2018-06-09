import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  template: `
  <div class="flex-column-around-center">
    <br><br>
    <h1>Whoops something went wrong</h1>
    <h2>Try refreshing your browser</h2>
  </div>
  `,
  styles: []
})
export class ErrorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
