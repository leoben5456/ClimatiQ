import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temperature'
})
export class TemperaturePipe implements PipeTransform {

  transform(value: number, unit: string): any {
    if (!value) {
      return '';
    }

    if (unit === 'C') {
      // Return temperature as an integer in Celsius
      return Math.round(value) + '°C';
    } else if (unit === 'F') {
      // Convert Celsius to Fahrenheit and return as an integer
      const fahrenheit = (value * 9 / 5) + 32;
      return Math.round(fahrenheit) + '°F';
    }
    return Math.round(value);
  }
}


