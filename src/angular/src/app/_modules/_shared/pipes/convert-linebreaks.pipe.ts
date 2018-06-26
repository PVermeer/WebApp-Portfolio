import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertLinebreaks'
})
export class ConvertLinebreaksPipe implements PipeTransform {

  transform(value: string): string {

    if (typeof value !== 'string' ) { return 'NOT A STRING, CANNOT CONVERT LINE BREAKS'; }

    return value.replace(/(?:\r\n|\r|\n)/g, '<br />');
  }

}
