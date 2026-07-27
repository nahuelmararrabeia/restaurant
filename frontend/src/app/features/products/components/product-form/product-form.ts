import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { Product } from '../../../../shared/domain/products/product';
import { ProductFormValue } from '../../models/product-form-value';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductForm {
  private readonly formBuilder = inject(FormBuilder);

  readonly initialValue = input<Product | null>(null);
  readonly loading = input(false);

  readonly save = output<ProductFormValue>();
  readonly cancel = output<void>();

  readonly form = this.formBuilder.nonNullable.group({
    name: [
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ],
    description: [
      '',
      [
        Validators.maxLength(500)
      ]
    ],
    price: [
      0,
      [
        Validators.required,
        Validators.min(0.01)
      ]
    ]
  });

  constructor() {
    effect(() => {
      const product = this.initialValue();

      if (!product) {
        return;
      }

      this.form.patchValue({
        name: product.name,
        description: product.description ?? '',
        price: product.price
      });
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.save.emit({
      name: value.name.trim(),
      description: value.description.trim() || null,
      price: value.price
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
