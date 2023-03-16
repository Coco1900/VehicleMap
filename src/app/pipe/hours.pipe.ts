import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hours'
})
export class HoursPipe implements PipeTransform {

  transform(value: number | null): string | null {
    if (value == null) return value;

    const hours = Math.floor(value/60);
    const minutesLeft = Math.floor(value % 60);
    return `${hours < 10 ? '0' : ''}${hours} heures ${minutesLeft < 10 ? '0': ''}${minutesLeft} min`
    
  }
}