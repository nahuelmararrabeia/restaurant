import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { RestaurantTable } from '../../../../shared/domain/tables/restaurant-table';
import { TableFormValue } from '../../models/table-form-value';

@Component({
  selector: 'table-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './table-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableForm {
  private readonly formBuilder = inject(FormBuilder);

  readonly initialValue = input<RestaurantTable | null>(null);
  readonly loading = input(false);

  readonly save = output<TableFormValue>();
  readonly cancel = output<void>();

  readonly form = this.formBuilder.nonNullable.group({
    number: [
      1,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],
    capacity: [
      1,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(50)
      ]
    ]
  });

  constructor() {
    effect(() => {
      const table = this.initialValue();

      if (!table) {
        return;
      }

      this.form.reset({
        number: table.number,
        capacity: table.capacity
      });

      this.form.markAsPristine();
      this.form.markAsUntouched();
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.save.emit({
      number: value.number,
      capacity: value.capacity
    });
  }

  cancelForm(): void {
    this.cancel.emit();
  }

  hasError(
    controlName: keyof typeof this.form.controls,
    errorName: string
  ): boolean {
    const control = this.form.controls[controlName];

    return control.touched && control.hasError(errorName);
  }
}