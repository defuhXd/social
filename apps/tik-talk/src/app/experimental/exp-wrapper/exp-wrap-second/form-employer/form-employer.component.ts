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
import { Address, Job, ReceiverType, ExpAge } from '../../../../../../../../libs/experimental/src/lib/data/interfaces';

@Component({
  selector: 'app-form-employer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-employer.component.html',
  styleUrls: ['./form-employer.component.scss'],
})
export class FormEmployerComponent implements OnInit, AfterViewInit, OnDestroy {
  private mockService = inject(MockService);
  private hostElement = inject(ElementRef);
  private r2 = inject(Renderer2);
  private fb = inject(FormBuilder);

  private destroyed$ = new Subject<void>();

  ReceiverType = ReceiverType;
  ExpAge = ExpAge;

  isSaving = false;

  form = this.fb.group({
    employers: this.fb.array<FormGroup>([]),
  });

  ngOnInit() {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .pipe(debounceTime(300), takeUntil(this.destroyed$))
      .subscribe(() => this.resizeFeed());

    this.loadJobs();
  }

  ngAfterViewInit() {
    this.resizeFeed();
  }
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  get employers(): FormArray<FormGroup> {
    return this.form.get('employers') as FormArray<FormGroup>;
  }

  getAddresses(employerGroup: FormGroup): FormArray<FormGroup> {
    return employerGroup.get('addresses') as FormArray<FormGroup>;
  }

  private createAddressForm(a: Partial<Address> = {}): FormGroup {
    return this.fb.group({
      city: [a.city ?? ''],
      street: [a.street ?? ''],
      building: [a.building ?? null],
      apartment: [a.apartment ?? null],
    });
  }

  createEmployerForm(data: Partial<Job> = {}): FormGroup {
    return this.fb.group({
      id: [data.id ?? null],
      companyName: [data.companyName ?? '', Validators.required],
      email: [data.email ?? '', [Validators.required, Validators.email]],
      phone: [
        data.phone ?? '',
        [
          Validators.required,
          Validators.pattern(/^\+7\s\(9\d{2}\)\s\d{3}-\d{2}-\d{2}$/),
        ],
      ],
      website: [data.website ?? '', Validators.required],
      educationType: [data.educationType ?? ReceiverType.VAL1],
      education: [data.education ?? ''],
      skills: [data.skills ?? ''],
      experience: [data.experience ?? ExpAge.VAL1],
      profession: [data.profession ?? '', Validators.required],
      addresses: this.fb.array<FormGroup>(
        (data.addresses && data.addresses.length ? data.addresses : [{}]).map(
          (a) => this.createAddressForm(a)
        )
      ),
    });
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  trackByEmployer(_: number, group: FormGroup) {
    return group.get('id')?.value ?? _;
  }

  trackByAddress(_: number, addressGroup: FormGroup) {
    const city = addressGroup.get('city')?.value;
    const street = addressGroup.get('street')?.value;
    return city && street ? `${city}-${street}` : _;
  }

  loadJobs() {
    this.mockService
      .getJobs()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (jobs) => {
          this.employers.clear();
          jobs.forEach((j) => this.employers.push(this.createEmployerForm(j)));
        },
        error: (err) => console.error('Не удалось загрузить вакансии', err),
      });
  }

  addEmploy() {
    this.employers.push(this.createEmployerForm());
  }

  deleteEmploy(employerGroup: FormGroup) {
    const id = employerGroup.get('id')?.value;
    if (!id) {
      const idx = this.employers.controls.indexOf(employerGroup);
      if (idx >= 0) this.employers.removeAt(idx);
      return;
    }

    if (!confirm('Удалить вакансию?')) return;

    this.mockService
      .deleteJob(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: () => {
          const idx = this.employers.controls.indexOf(employerGroup);
          if (idx >= 0) this.employers.removeAt(idx);
        },
        error: (err) => console.error('Ошибка удаления', err),
      });
  }

  editEmploy(employerGroup: FormGroup) {
    const job = employerGroup.value as Job;
    if (!job.id) {
      console.warn('Вакансия ещё не сохранена, используйте Добавить');
      return;
    }
    this.mockService
      .updateJob(job.id, job)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: () => console.log(`Вакансия id=${job.id} обновлена`),
        error: (err) => console.error('Ошибка обновления', err),
      });
  }

  saveEmploy(employerGroup: FormGroup) {
    const job = employerGroup.value as Job;
    this.isSaving = true;
    if (job.id) {
      this.mockService
        .updateJob(job.id, job)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: () => (this.isSaving = false),
          error: (err) => {
            this.isSaving = false;
            console.error('Ошибка сохранения', err);
          },
        });
    } else {
      this.mockService
        .addJob(job)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (saved) => {
            employerGroup.patchValue({ id: saved.id }, { emitEvent: false });
            this.isSaving = false;
          },
          error: (err) => {
            this.isSaving = false;
            console.error('Ошибка создания', err);
          },
        });
    }
  }

  addAddress(employerGroup: FormGroup) {
    this.getAddresses(employerGroup).push(this.createAddressForm());
    const job = employerGroup.value as Job;
    if (job.id) {
      this.mockService
        .updateJob(job.id, job)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: () => console.log('Адрес добавлен и сервер обновлён'),
          error: (err) => console.error('Ошибка при добавлении адреса', err),
        });
    }
  }

  deleteAddress(employerGroup: FormGroup, index: number) {
    this.getAddresses(employerGroup).removeAt(index);
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

  onSubmit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      console.warn('Форма невалидна — исправь ошибки');
      return;
    }

    this.employers.controls.forEach((group) => this.saveEmploy(group));
  }
}
