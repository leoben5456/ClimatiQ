import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humidity'
})
export class HumidityPipe implements PipeTransform {

  transform(value: number, unit: string): string {
    if (unit === '%') {
      return `${value} %`;
    } else if (unit === 'g/m³') {

      const convertedValue = value * 0.216;
      return `${convertedValue.toFixed(2)}g/m³`;
    } else {
      return `${value}%`;
    }
  }

}

