import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "utcDate",
})
export class UtcDatePipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(value);
    return date.toUTCString();
  }
}
