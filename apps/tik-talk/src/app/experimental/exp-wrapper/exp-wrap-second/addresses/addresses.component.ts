import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { generateUid } from '../../../../../../../../libs/experimental/src/lib/data/utils/uid';
import {AddressFormComponent} from '../address-form/address-form.component';

@Component({
  selector: 'app-addresses',
  imports: [
    AddressFormComponent
  ],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.scss',
})
export class AddressesComponent {
  @Input({ required: true }) parentFormArray!: FormArray;

  constructor(private fb: FormBuilder) {}

  addAddress() {
    const group = this.fb.group({
      uid: [generateUid()],
      city: [''],
      street: [''],
      building: [''],
      apartment: [''],
    });
    this.parentFormArray.push(group);
  }

  deleteAddress(index: number) {
    this.parentFormArray.removeAt(index);
  }

  trackByUid(_: number, group: FormGroup) {
    return group.get('uid')?.value;
  }
}
