import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ProductForm } from '../../components/product-form/product-form';
import { ProductFormValue } from '../../models/product-form-value';
import { ProductsApi } from '../../services/products-api';
import { SubsectionHeader } from '../../../../shared/components/subsection-header/subsection-header';
import { ErrorState } from '../../../../shared/components/error-state/error-state';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [ProductForm, SubsectionHeader, ErrorState],
  templateUrl: './create-product.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateProduct {
  private readonly productsApi = inject(ProductsApi);
  private readonly router = inject(Router);

  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  createProduct(value: ProductFormValue): void {
    if (this.saving()) {
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    this.productsApi
      .create({
        name: value.name,
        description: value.description,
        price: value.price
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigate(['/products']);
        },
        error: () => {
          this.error.set(
            'No se pudo crear el producto. Intentá nuevamente.'
          );
        }
      });
  }

  cancel(): void {
    void this.router.navigate(['/products']);
  }
}