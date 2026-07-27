import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductsApi } from '../../services/products-api';
import { Product } from '../../../../shared/domain/products/product';
import { finalize } from 'rxjs';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { LoadingState } from '../../../../shared/components/loading-state/loading-state';
import { ErrorState } from '../../../../shared/components/error-state/error-state';
import { ProductsTable } from '../../components/products-table/products-table';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    SectionHeader,
    LoadingState,
    ErrorState,
    ProductsTable,
    EmptyState
  ],
  templateUrl: './product-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductList implements OnInit {
  private readonly productsApi = inject(ProductsApi);
  private readonly destroyRef = inject(DestroyRef);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly deletingProductId = signal<number | null>(null);
  readonly actionError = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productsApi
      .getAll()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: products => {
          this.products.set(products);
        },
        error: () => {
          this.error.set('Could not load products.');
        }
      });
  }

  deleteProduct(product: Product): void {
    if (this.deletingProductId() !== null) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    this.deletingProductId.set(product.id);
    this.actionError.set(null);

    this.productsApi
      .delete(product.id)
      .pipe(
        finalize(() => this.deletingProductId.set(null)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.products.update(products =>
            products.filter(current => current.id !== product.id)
          );
        },
        error: (error: HttpErrorResponse) => {
          this.actionError.set(
            error.status === 409 || error.status === 400
              ? `"${product.name}" cannot be deleted because it is used in existing orders.`
              : `"${product.name}" could not be deleted. Please try again.`
          );
        }
      });
  }

  clearActionError(): void {
    this.actionError.set(null);
  }
}
