import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'windSpeed'
})
export class WindSpeedPipe implements PipeTransform {

  transform(value: number, unit: string): any {
    if (!value) {
      return '';
    }

    if (unit === 'Km/h') {
      return value + ' Km/h';
    } else if (unit === 'M/h') {
      // Convert Km/h to M/h
      const milesPerHour = value * 0.621371;
      return milesPerHour.toFixed(2) + ' M/h';
    }
    return value;
  }

}
