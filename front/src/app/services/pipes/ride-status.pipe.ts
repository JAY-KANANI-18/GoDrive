import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rideStatus'
})
export class RideStatusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    switch (value) {
      case 0:
        return 'pending'
      case 1:
        return 'assigning'
      case 2:
        return 'accepted'
      case 3:
        return 'arrived'
      case 4:
        return 'picked'
      case 5:
        return 'started'
      case 6:
        return 'completed'
      case 7:
        return 'cancelled'
      default:
        return 'completed'
    }
  }

}
