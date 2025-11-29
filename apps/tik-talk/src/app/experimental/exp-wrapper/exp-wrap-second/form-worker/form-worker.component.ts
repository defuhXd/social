import {
  Component,
  ElementRef,
  inject,
  Renderer2,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { fromEvent, Subject, debounceTime, takeUntil } from 'rxjs';
import { MockService } from '../../../../../../../../libs/experimental/src/lib/data/services/mock.service';
import { Address, Worker, ReceiverType } from '../../../../../../../../libs/experimental/src/lib/data/interfaces';

@Component({
  selector: 'app-form-worker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-worker.component.html',
  styleUrls: ['./form-worker.component.scss'],
})
export class FormWorkerComponent implements OnInit, AfterViewInit, OnDestroy {
  private mockService = inject(MockService);
  private hostElement = inject(ElementRef);
  private r2 = inject(Renderer2);
  private destroyed$ = new Subject<void>();

  ReceiverType = ReceiverType;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      workers: this.fb.array<FormGroup>([]),
    });
  }

  private createAddressForm(a: Partial<Address> = {}) {
    return this.fb.group({
      city: [a.city],
      street: [a.street],
      building: [a.building],
      apartment: [a.apartment],
    });
  }

  createWorkerFormFromData(data: Partial<Worker & { id?: number }> = {}) {
    return this.fb.group({
      id: [data.id],
      firstName: [data.firstName ?? '', Validators.required],
      lastName: [data.lastName ?? '', Validators.required],
      email: [data.email ?? '', [Validators.required, Validators.email]],
      phone: [
        data.phone ?? '',
        [
          Validators.required,
          Validators.pattern(/^\+7\s\(9\d{2}\)\s\d{3}-\d{2}-\d{2}$/),
        ],
      ],
      birthDate: [data.birthDate ?? '', Validators.required],
      educationType: [data.educationType ?? ReceiverType.VAL1],
      education: [data.education ?? ''],
      skills: [data.skills ?? ''],
      experience: [data.experience ?? ''],
      profession: [data.profession ?? ''],
      addresses: this.fb.array<FormGroup>(
        (data.addresses?.length ? data.addresses : [{}]).map((a) =>
          this.createAddressForm(a)
        )
      ),
    });
  }

  ngOnInit() {
    this.loadWorkers();
    fromEvent(window, 'resize')
      .pipe(debounceTime(300), takeUntil(this.destroyed$))
      .subscribe(() => this.resizeFeed());
  }

  ngAfterViewInit() {
    this.resizeFeed();
  }
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  get workers(): FormArray<FormGroup> {
    return this.form.get('workers') as FormArray<FormGroup>;
  }
  getAddresses(group: FormGroup): FormArray<FormGroup> {
    return group.get('addresses') as FormArray<FormGroup>;
  }

  addWorker() {
    this.workers.push(this.createWorkerFormFromData());
  }
  deleteWorker(group: FormGroup) {
    const id = group.get('id')?.value;
    if (!id) {
      this.workers.removeAt(this.workers.controls.indexOf(group));
      return;
    }
    if (!confirm('Удалить работника?')) return;
    this.mockService
      .deleteWorker(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: () => this.workers.removeAt(this.workers.controls.indexOf(group)),
        error: (err) => console.error(err),
      });
  }

  addAddress(group: FormGroup) {
    this.getAddresses(group).push(this.createAddressForm());
  }
  deleteAddress(group: FormGroup, idx: number) {
    this.getAddresses(group).removeAt(idx);
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  saveWorker(group: FormGroup) {
    const worker = group.value as Worker;
    if (worker.id) {
      this.mockService
        .updateWorker(worker.id, worker)
        .pipe(takeUntil(this.destroyed$))
        .subscribe();
    } else {
      this.mockService
        .addWorker(worker)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((saved) => {
          group.patchValue({ id: saved.id }, { emitEvent: false });
        });
    }
  }

  onPhoneInput(event: Event, group: FormGroup) {
    const input = event.target as HTMLInputElement;
    let digits = input.value.replace(/\D/g, '');
    if (!digits.startsWith('7')) digits = '7' + digits;
    let formatted = '+7 ';
    if (digits.length > 1) formatted += '(' + digits.slice(1, 4);
    if (digits.length >= 4) formatted += ') ' + digits.slice(4, 7);
    if (digits.length >= 7) formatted += '-' + digits.slice(7, 9);
    if (digits.length >= 9) formatted += '-' + digits.slice(9, 11);
    input.value = formatted;
    group.get('phone')?.setValue(formatted, { emitEvent: false });
  }

  loadWorkers() {
    this.mockService
      .getWorkers()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((workers) => {
        this.workers.clear();
        workers.forEach((w) =>
          this.workers.push(this.createWorkerFormFromData(w))
        );
      });
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.workers.controls.forEach((g) => this.saveWorker(g));
  }

  // Простая функция для генерации временного UID
  generateUID(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
