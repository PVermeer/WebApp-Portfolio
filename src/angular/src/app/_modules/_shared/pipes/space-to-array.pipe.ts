import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spaceToArray'
})
export class SpaceToArrayPipe implements PipeTransform {

  transform(value: string): string[] {

    if (!value) { return undefined; }
    if (typeof value !== 'string') { throw new Error('Not a string'); }

    return value.split(' ');
  }

}
