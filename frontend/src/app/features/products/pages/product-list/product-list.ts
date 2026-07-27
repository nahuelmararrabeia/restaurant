import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductStatusBadge } from '../../components/product-status-badge/product-status-badge';
import { ProductsApi } from '../../services/products-api';
import { Product } from '../../../../shared/domain/products/product';
import { finalize } from 'rxjs';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { LoadingState } from '../../../../shared/components/loading-state/loading-state';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    RouterLink,
    ProductStatusBadge,
    SectionHeader,
    LoadingState
  ],
  templateUrl: './product-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductList implements OnInit {
  private readonly productsApi = inject(ProductsApi);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productsApi
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: products => {
          this.products.set(products);
        },
        error: () => {
          this.error.set('Could not load products.');
        }
      });
  }
}
