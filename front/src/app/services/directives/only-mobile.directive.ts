import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyMobile]'
})
export class OnlyMobileDirective {


  @HostListener('keydown', ['$event'])


  onKeyDown(event: any) {

    const charCode = event.which ? event.which : event.keyCode;
    console.log(charCode);



    // if(charCode===69 ){

    //   event.preventDefault();
    // }

    // if(event.target.value.length > 9 && charCode > 31 && (charCode < 48 || charCode > 57 ) && (charCode > 95 && charCode> 105) ){


    // }
      if (charCode > 31 && (charCode < 48 || charCode > 57 ) && (charCode > 95 && charCode> 105) || charCode==69 && (charCode !> 111 && charCode !< 123)) {
              event.preventDefault();

      }

  }
}
