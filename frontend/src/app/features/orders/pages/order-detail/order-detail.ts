import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, forkJoin } from 'rxjs';

import { Order } from '../../../../shared/domain/orders/order';
import { OrderStatusBadge } from '../../components/order-status-badge/order-status-badge';
import { OrdersApi } from '../../services/orders-api';
import { AddOrderItemForm } from '../../components/add-order-item-form/add-order-item-form';
import { ORDER_STATUS } from '../../../../shared/domain/orders/order-status';
import { Product } from '../../../../shared/domain/products/product';
import { ProductsApi } from '../../../products/services/products-api';
import { OrderItemFormValue } from '../../models/order-item-form-value';
import { HttpErrorResponse } from '@angular/common/http';

type OrderItemAction = 'update' | 'remove';

interface OrderItemActionState {
  itemId: number;
  action: OrderItemAction;
}

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
    OrderStatusBadge,
    AddOrderItemForm
  ],
  templateUrl: './order-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly ordersApi = inject(OrdersApi);
  private readonly destroyRef = inject(DestroyRef);

  readonly addItemForm = viewChild(AddOrderItemForm);

  readonly order = signal<Order | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  private readonly productsApi = inject(ProductsApi);

  readonly products = signal<Product[]>([]);

  readonly addingItem = signal(false);
  readonly actionError = signal<string | null>(null);
  readonly itemAction = signal<OrderItemActionState | null>(null);

  readonly totalUnits = computed(() => {
    const order = this.order();

    if (!order) {
      return 0;
    }

    return order.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  });

  readonly canEdit = computed(() => {
    const order = this.order();

    return order?.status === ORDER_STATUS.Pending;
  });

  private orderId: number | null = null;

  ngOnInit(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!Number.isInteger(id) || id <= 0) {
      this.error.set('El identificador de la orden no es válido.');
      return;
    }

    this.orderId = id;
    this.loadOrder();
  }

  loadOrder(): void {
    if (this.orderId === null || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      order: this.ordersApi.getById(this.orderId),
      products: this.productsApi.getAll()
    })
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: ({ order, products }) => {
          this.order.set(order);
          this.products.set(products);
        },
        error: () => {
          this.error.set(
            'No se pudo cargar la información de la orden.'
          );
        }
      });
  }

  addItem(value: OrderItemFormValue): void {
    if (
      this.orderId === null ||
      this.addingItem() ||
      !this.canEdit()
    ) {
      return;
    }

    this.addingItem.set(true);
    this.actionError.set(null);

    this.ordersApi
      .addItem(this.orderId, {
        productId: value.productId,
        quantity: value.quantity,
        notes: value.notes
      })
      .pipe(
        finalize(() => this.addingItem.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: order => {
          this.order.set(order);
          this.addItemForm()?.reset();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.actionError.set(
              'La orden ya no puede modificarse porque cambió de estado.'
            );

            this.loadOrder();
            return;
          }

          if (error.status === 404) {
            this.actionError.set(
              'La orden o el producto seleccionado ya no existe.'
            );
            return;
          }

          this.actionError.set(
            'No se pudo agregar el producto. Intentá nuevamente.'
          );
        }
      });
  }

  changeItemQuantity(
    itemId: number,
    currentQuantity: number,
    delta: number
  ): void {
    const quantity = currentQuantity + delta;

    if (quantity < 1) {
      return;
    }

    this.updateItem(itemId, quantity);
  }

  removeItem(itemId: number): void {
    if (
      this.orderId === null ||
      !this.canEdit() ||
      this.itemAction() !== null
    ) {
      return;
    }

    const item = this.order()
      ?.items
      .find(current => current.id === itemId);

    if (!item) {
      return;
    }

    const confirmed = window.confirm(
      `¿Eliminar "${item.productName}" de la orden?`
    );

    if (!confirmed) {
      return;
    }

    this.itemAction.set({
      itemId,
      action: 'remove'
    });

    this.actionError.set(null);

    this.ordersApi
      .removeItem(this.orderId, itemId)
      .pipe(
        finalize(() => this.itemAction.set(null)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: order => {
          this.order.set(order);
        },
        error: (error: HttpErrorResponse) => {
          this.handleItemActionError(error);
        }
      });
  }

  isItemBusy(itemId: number): boolean {
    return this.itemAction()?.itemId === itemId;
  }

  isItemActionRunning(
    itemId: number,
    action: OrderItemAction
  ): boolean {
    const current = this.itemAction();

    return current?.itemId === itemId &&
      current.action === action;
  }

  clearActionError(): void {
    this.actionError.set(null);
  }

  private updateItem(
    itemId: number,
    quantity: number
  ): void {
    if (
      this.orderId === null ||
      !this.canEdit() ||
      this.itemAction() !== null
    ) {
      return;
    }

    const currentItem = this.order()
      ?.items
      .find(item => item.id === itemId);

    if (!currentItem) {
      return;
    }

    this.itemAction.set({
      itemId,
      action: 'update'
    });

    this.actionError.set(null);

    this.ordersApi
      .updateItem(
        this.orderId,
        itemId,
        {
          quantity,
          notes: currentItem.notes
        }
      )
      .pipe(
        finalize(() => this.itemAction.set(null)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: order => {
          this.order.set(order);
        },
        error: (error: HttpErrorResponse) => {
          this.handleItemActionError(error);
        }
      });
  }

  private handleItemActionError(
    error: HttpErrorResponse
  ): void {
    if (error.status === 404) {
      this.actionError.set(
        'La orden o el producto ya no existe.'
      );
      return;
    }

    if (error.status === 409) {
      this.actionError.set(
        'La orden cambió de estado y ya no puede modificarse.'
      );
      return;
    }

    this.actionError.set(
      'No se pudo actualizar la orden. Intentá nuevamente.'
    );
  }
}