import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAppNumericOnly]'
})
export class AppNumericOnlyDirective {


  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const isNumberKey = event.key >= '0' && event.key <= '9';
    if (isNumberKey) {
      event.preventDefault();
    }
  }

}
