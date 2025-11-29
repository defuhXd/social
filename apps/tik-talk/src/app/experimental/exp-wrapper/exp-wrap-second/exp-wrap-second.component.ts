import { Component, ElementRef, inject, Renderer2 } from '@angular/core';
import { FormEmployerComponent } from './form-employer/form-employer.component';
import { FormWorkerComponent } from './form-worker/form-worker.component';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, fromEvent, Subject, takeUntil } from 'rxjs';

enum ReceiverType {
  EMPLOYER = 'EMPLOYER',
  WORKER = 'WORKER',
}

@Component({
  selector: 'app-exp-wrap-second',
  imports: [FormEmployerComponent, FormWorkerComponent, ReactiveFormsModule],
  templateUrl: './exp-wrap-second.component.html',
  styleUrl: './exp-wrap-second.component.scss',
})
export class ExpWrapSecondComponent {
  ReceiverType = ReceiverType;

  form = new FormGroup({
    type: new FormControl<ReceiverType>(ReceiverType.EMPLOYER),
  });
}
