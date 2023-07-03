import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "paymentModes",
})
export class PaymentModesPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    switch (value) {
      case 0:
        return "cash";
      case 1:
        return "card";
      case 2:
        return "both";

      default:
        return "reassign";
    }
  }
}
