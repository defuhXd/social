import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Address } from '../interfaces/address.interface';

export function getFormAddress(addr?: Address) {
  return new FormGroup({
    city: new FormControl<string>(addr?.city ?? '', Validators.required),
    street: new FormControl<string>(addr?.street ?? '', Validators.required),
    building: new FormControl<number | null>(
      addr?.building ?? null,
      Validators.required
    ),
    apartment: new FormControl<number | null>(addr?.apartment ?? null),
  });
}
