import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.open') dropdownStatus: boolean = false;
  
  @HostListener('click') switchDropdown() {
    this.dropdownStatus = !this.dropdownStatus;
  }

}
