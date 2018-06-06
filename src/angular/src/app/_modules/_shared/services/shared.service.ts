import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public swapIndexArray(array: any[], indexA: number, indexB: number) {
    const temp = array[indexA];
    array[indexA] = array[indexB];
    array[indexB] = temp;

    return array;
  }

  constructor() { }
}
