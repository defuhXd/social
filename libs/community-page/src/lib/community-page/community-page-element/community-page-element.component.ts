import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { debounceTime, fromEvent } from 'rxjs';

@Component({
  selector: 'app-community-page-element',
  imports: [],
  templateUrl: './community-page-element.component.html',
  styleUrl: './community-page-element.component.scss',
})
export class CommunityPageElementComponent implements OnInit, OnDestroy {
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  ngOnInit() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe((event) => {
        this.resizeFeed();
        console.log(123);
      });
  }

  ngAfterViewInit() {
    this.resizeFeed();
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24;

    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  ngOnDestroy() {}
}
