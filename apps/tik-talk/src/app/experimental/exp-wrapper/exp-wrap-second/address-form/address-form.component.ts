import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-adress" [formGroup]="addressGroup">
      <label class="tt-control-label"
        >Город
        <input
          formControlName="city"
          class="tt-input"
          type="text"
          placeholder="Введите город"
        />
      </label>
      <label class="tt-control-label"
        >Улица
        <input
          formControlName="street"
          class="tt-input"
          type="text"
          placeholder="Введите улицу"
        />
      </label>
      <label class="tt-control-label"
        >Дом
        <input
          formControlName="building"
          class="tt-input"
          type="text"
          placeholder="Введите дом"
        />
      </label>
      <div class="form-address-lastel">
        <label class="tt-control-label"
          >Квартира
          <input
            formControlName="apartment"
            class="tt-input"
            type="text"
            placeholder="Введите квартиру"
          />
        </label>
        <div class="address-del">
          <span>Удалить адрес:</span>
          <button type="button" class="btn" (click)="remove.emit()">-</button>
        </div>
      </div>
    </div>
  `,
})
export class AddressFormComponent {
  @Input() addressGroup!: FormGroup;
  @Output() remove = new EventEmitter<void>();
}
