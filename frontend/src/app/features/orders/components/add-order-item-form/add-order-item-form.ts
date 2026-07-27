import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

import { Product } from '../../../../shared/domain/products/product';
import { OrderItemFormValue } from '../../models/order-item-form-value';

interface AddOrderItemFormControls {
  productId: FormControl<number | null>;
  quantity: FormControl<number>;
  notes: FormControl<string>;
}

@Component({
  selector: 'app-add-order-item-form',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './add-order-item-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddOrderItemForm {
  readonly products = input.required<Product[]>();
  readonly loading = input(false);
  readonly disabled = input(false);

  readonly addItem = output<OrderItemFormValue>();

  readonly form = new FormGroup<AddOrderItemFormControls>({
    productId: new FormControl<number | null>(null, {
      validators: [Validators.required]
    }),
    quantity: new FormControl(1, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(1)
      ]
    }),
    notes: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.maxLength(250)
      ]
    })
  });

  constructor() {
    effect(() => {
      const shouldDisable =
        this.loading() || this.disabled();

      if (shouldDisable) {
        this.form.disable({
          emitEvent: false
        });
      } else {
        this.form.enable({
          emitEvent: false
        });
      }
    });
  }

  submit(): void {
    if (this.form.invalid || this.loading() || this.disabled()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (value.productId === null) {
      return;
    }

    this.addItem.emit({
      productId: value.productId,
      quantity: value.quantity,
      notes: value.notes.trim() || null
    });
  }

  reset(): void {
    this.form.reset({
      productId: null,
      quantity: 1,
      notes: ''
    });

    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
