import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rideAssignType'
})
export class RideAssignTypePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    switch (value) {
      case 0:
        return 'auto'
      case 1:
        return 'next'
      case 2:
        return 'selected'
      case 3:
        return 'rejected'
      case 4:
        return 'reassign'

      default:
        return 'reassign'
    }
  }

}
