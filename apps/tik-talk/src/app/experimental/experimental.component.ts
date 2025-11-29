import { Component } from '@angular/core';
import { ExpWrapperComponent } from './exp-wrapper/exp-wrapper.component';

@Component({
  selector: 'app-experimental',
  imports: [ExpWrapperComponent],
  templateUrl: './experimental.component.html',
  styleUrl: './experimental.component.scss',
})
export class ExperimentalComponent {}
