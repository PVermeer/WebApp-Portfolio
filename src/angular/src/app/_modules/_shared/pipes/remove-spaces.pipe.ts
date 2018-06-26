import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeSpaces'
})
export class RemoveSpacesPipe implements PipeTransform {

  transform(value: string): any {

    if (!value) { return undefined; }
    if (typeof value !== 'string') { throw new Error('Not a string'); }

    return value.replace(/ /g, '');
  }

}
