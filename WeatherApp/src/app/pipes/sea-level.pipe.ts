import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'seaLevel'
})
export class SeaLevelPipe implements PipeTransform {

  transform(value: number, unit: string): string {
    if (unit === 'mmHg') {
      const convertedValue = Math.round(value / 1.33322); 
      return `${convertedValue} mmHg`;
    } else if (unit === 'inHg') {
      const convertedValue = Math.round(value / 33.8639);
      return `${convertedValue} inHg`;
    } else if (unit === 'hPa') {
      const roundedValue = Math.round(value);
      return `${roundedValue} hPa`;
    } else {
      throw new Error('Unsupported unit');
    }
  }


}
