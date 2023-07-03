import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "driverApprove",
})
export class DriverApprovePipe implements PipeTransform {
  transform(value: any) {
    switch (value) {
      case 0:
        return "pending";
      case 1:
        return "approved";
      case 2:
        return "declined";
      default:
        return "pending";
    }
  }
}
