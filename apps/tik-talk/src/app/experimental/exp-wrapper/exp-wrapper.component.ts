import { Component } from '@angular/core';
import { ExpWrapFirstComponent } from '../../../../../../libs/experimental/src/lib/feature-first-form/exp-wrap-first/exp-wrap-first.component';
import { ExpWrapSecondComponent } from './exp-wrap-second/exp-wrap-second.component';

@Component({
  selector: 'app-exp-wrapper',
  imports: [ExpWrapFirstComponent, ExpWrapSecondComponent],
  templateUrl: './exp-wrapper.component.html',
  styleUrl: './exp-wrapper.component.scss',
})
export class ExpWrapperComponent {}
