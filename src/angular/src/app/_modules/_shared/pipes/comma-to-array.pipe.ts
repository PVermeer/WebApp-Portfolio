import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaToArray'
})
export class CommaToArrayPipe implements PipeTransform {

  transform(value: any): any {

    if (!value) { return undefined; }
    if (typeof value !== 'string') { throw new Error('Not a string'); }

    return value.split(',');
  }

}
