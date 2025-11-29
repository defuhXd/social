import { Component, ElementRef, inject, Renderer2 } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MockService } from '../../data/services/mock.service';
import { debounceTime, fromEvent, Subject, takeUntil } from 'rxjs';

enum ReceiverType {
  PERSON = 'PERSON',
  LEGAL = 'LEGAL',
}

interface Address {
  city?: string;
  street?: string;
  building?: number | null;
  apartment?: number | null;
}
function getFormAddress(initialValue: Address = {}) {
  return new FormGroup({
    city: new FormControl<string>(initialValue.city ?? ''),
    street: new FormControl<string>(initialValue.street ?? ''),
    building: new FormControl<number | null>(initialValue.building ?? null),
    apartment: new FormControl<number | null>(initialValue.apartment ?? null),
  });
}

@Component({
  selector: 'app-exp-wrap-first',
  imports: [ReactiveFormsModule],
  templateUrl: './exp-wrap-first.component.html',
  styleUrl: './exp-wrap-first.component.scss',
})
export class ExpWrapFirstComponent {
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);
  private destroyed$ = new Subject<void>();

  ngOnInit() {
    this.resizeFeed();
    fromEvent(window, 'resize')
      .pipe(debounceTime(300), takeUntil(this.destroyed$))
      .subscribe(() => {
        this.resizeFeed();
        console.log(123);
      });
  }

  ngAfterViewInit() {
    this.resizeFeed();
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  mockService = inject(MockService);

  ReceiverType = ReceiverType;

  sendForm = new FormGroup({
    type: new FormControl<ReceiverType>(ReceiverType.PERSON),
    name: new FormControl<string>('', Validators.required),
    lastName: new FormControl<string>(''),
    inn: new FormControl<string>(''),
    addresses: new FormArray([getFormAddress()]),
  });

  constructor() {
    this.mockService
      .getAddresses()
      .pipe(takeUntilDestroyed())
      .subscribe((addrs) => {
        // очищаем текущие адреса
        // while (this.sendForm.controls.addresses.length > 0) {
        //   this.sendForm.controls.addresses.removeAt(0, {emitEvent: false })
        // }
        this.sendForm.controls.addresses.clear({ emitEvent: false });
        // пушим новые адреса из сервиса
        for (const addr of addrs) {
          this.sendForm.controls.addresses.push(getFormAddress(addr));
        }
      });

    // динамические валидаторы для ИНН
    this.sendForm.controls.type.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((val) => {
        // console.log(val)
        this.sendForm.controls.inn.clearValidators();

        if (val === ReceiverType.LEGAL) {
          this.sendForm.controls.inn.setValidators([
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(12),
          ]);
        }
        this.sendForm.controls.inn.updateValueAndValidity();
      });
    // логирование значений
    this.sendForm.valueChanges.subscribe((val) => {
      console.log(val);
    });

    // this.sendForm.controls.name.patchValue('Ivan')
    //
    // this.sendForm.controls.address.setValue({
    //     city:'Moscow',
    //     street:'Lenina',
    //     building: 12,
    //     apartment: 12
    // })
  }

  onSubmit(event: SubmitEvent) {
    this.sendForm.markAllAsTouched();
    this.sendForm.updateValueAndValidity();

    if (this.sendForm.invalid) return;

    console.log(this.sendForm.valid);
    console.log(this.sendForm.value);
    console.log('raw', this.sendForm.getRawValue());
  }

  addAddress() {
    // this.sendForm.controls.addresses.push(getFormAddress())
    this.sendForm.controls.addresses.insert(0, getFormAddress());
  }

  deleteAddress(index: number) {
    this.sendForm.controls.addresses.removeAt(index, { emitEvent: false });
  }
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
