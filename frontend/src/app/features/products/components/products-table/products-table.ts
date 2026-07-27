import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core';
import { ProductStatusBadge } from '../product-status-badge/product-status-badge';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../shared/domain/products/product';

@Component({
  selector: 'products-table',
  standalone: true,
  imports: [
    CurrencyPipe,
    ProductStatusBadge,
    RouterLink
  ],
  templateUrl: './products-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsTable {
  readonly products = input.required<Product[]>();
  readonly deletingProductId = input<number | null>(null);
  readonly deleteProduct = output<Product>();
}
