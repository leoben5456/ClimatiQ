import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(time: string, is12HourFormat: boolean): string {
    let [hours, minutes] = time.split(':').map(part => parseInt(part, 10));

    if (is12HourFormat) {
      const suffix = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${this.pad(hours)}:${this.pad(minutes)} ${suffix}`;
    } else {

      return `${this.pad(hours)}:${this.pad(minutes)}`;
    }
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
