import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  EMPTY,
  finalize,
  switchMap
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Product } from '../../../../shared/domain/products/product';
import { ProductForm } from '../../components/product-form/product-form';
import { ProductFormValue } from '../../models/product-form-value';
import { UpdateProductRequest } from '../../models/update-product-request';
import { ProductsApi } from '../../services/products-api';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [ProductForm],
  templateUrl: './edit-product.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditProduct implements OnInit {
  private readonly productsApi = inject(ProductsApi);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly product = signal<Product | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly saveError = signal<string | null>(null);

  private productId: number | null = null;

  ngOnInit(): void {
    this.loadProduct();
  }

  updateProduct(value: ProductFormValue): void {
    if (this.productId === null || this.saving()) {
      return;
    }

    const request: UpdateProductRequest = {
      name: value.name,
      description: value.description,
      price: value.price
    };

    this.saving.set(true);
    this.saveError.set(null);

    this.productsApi
      .update(this.productId, request)
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          void this.router.navigate(['/products']);
        },
        error: () => {
          this.saveError.set(
            'No se pudo actualizar el producto. Intentá nuevamente.'
          );
        }
      });
  }

  cancel(): void {
    void this.router.navigate(['/products']);
  }

  retry(): void {
    this.loadProduct();
  }

  private loadProduct(): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.product.set(null);
    this.productId = null;

    const rawId = this.route.snapshot.paramMap.get('id');
    const id = Number(rawId);

    if (
      rawId === null ||
      !Number.isInteger(id) ||
      id <= 0
    ) {
      this.loadError.set(
        'El identificador del producto no es válido.'
      );
      this.loading.set(false);
      return;
    }

    this.productId = id;

    this.productsApi
      .getById(id)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: product => {
          this.product.set(product);
        },
        error: () => {
          this.loadError.set(
            'No se pudo cargar el producto.'
          );
        }
      });
  }
}