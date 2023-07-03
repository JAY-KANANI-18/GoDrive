import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "driverStatus",
})
export class DriverStatusPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    switch (value) {
      case 0:
        return "offline";
      case 1:
        return "online";
      case 2:
        return "hold";
      default:
        return "onride";
    }
  }
}
