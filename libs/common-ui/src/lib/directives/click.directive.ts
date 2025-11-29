import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appClick]',
  standalone: true,
})
export class ClickDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: HTMLElement) {}
  onDocumentClick(targetElement: HTMLElement) {
    console.log(targetElement);
    this.el.nativeElement.contains(targetElement as HTMLElement);
  }
}
