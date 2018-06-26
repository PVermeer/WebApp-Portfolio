import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'domainName'
})
export class DomainNamePipe implements PipeTransform {

  transform(value: any): any {

    if (typeof value !== 'string') { return 'NOT A STRING, CANNOT CONVERT TO DOMAIN NAME'; }

    if (value.includes('stackoverflow')) {
      return 'stack-overflow';
    } else if (value.slice(0, 12) === 'https://www.' || value.slice(0, 12) === 'http://www.') {
      return value.split('.')[1];
    } else if (value.slice(0, 8) === 'https://') {
      return value.slice(8).split('.')[0];
    } else if (value.slice(0, 7) === 'http://') {
      return value.slice(7).split('.')[0];
    } else {
      return 'NO MATCHING CONDITIONS, CANNOT CONVERT TO DOMAIN NAME';
    }
  }

}
