import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterArray'
})
export class FilterArrayPipe implements PipeTransform {

  transform(value: any[], filter: { objectPath: string, filterValue: any }): any[] {

    if (!value.length || value.length === 0) { throw new Error('Not an array in filterArray pipe'); }

    if (!filter.objectPath) {
      return value.filter(x => x === filter.filterValue);
    }
    return value.filter(x => x[filter.objectPath] === filter.filterValue);
  }

}
