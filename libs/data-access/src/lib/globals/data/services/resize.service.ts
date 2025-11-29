import {ElementRef, inject, Injectable, Renderer2} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {

  r2 = inject(Renderer2);
  hostElement = inject(ElementRef);

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

}
