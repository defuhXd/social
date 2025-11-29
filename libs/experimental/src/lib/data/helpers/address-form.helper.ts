import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export function createAddressGroup(fb: FormBuilder, data?: any): FormGroup {
  return fb.group({
    country: [data?.country || '', Validators.required],
    region: [data?.region || '', Validators.required],
    city: [data?.city || '', Validators.required],
    street: [data?.street || '', Validators.required],
    house: [data?.house || '', Validators.required],
    apartment: [data?.apartment || '', Validators.required],
  });
}
