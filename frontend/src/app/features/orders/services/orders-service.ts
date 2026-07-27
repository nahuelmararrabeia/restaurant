import { HttpErrorResponse } from '@angular/common/http';
import {
  DestroyRef,
  Injectable,
  computed,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, finalize, forkJoin } from 'rxjs';

import { Order } from '../../../shared/domain/orders/order';
import { ORDER_STATUS } from '../../../shared/domain/orders/order-status';
import { Product } from '../../../shared/domain/products/product';
import { ProductsApi } from '../../products/services/products-api';
import { OrderItemFormValue } from '../models/order-item-form-value';
import { OrdersApi } from './orders-api';

export type OrderItemAction = 'update' | 'remove';

interface OrderItemActionState {
  itemId: number;
  action: OrderItemAction;
}

export type OrderAction =
  | 'start-preparing'
  | 'mark-ready'
  | 'deliver'
  | 'cancel';

@Injectable()
export class OrdersService {
  private readonly ordersApi = inject(OrdersApi);
  private readonly productsApi = inject(ProductsApi);
  private readonly destroyRef = inject(DestroyRef);

  private orderId: number | null = null;

  readonly order = signal<Order | null>(null);
  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly addingItem = signal(false);
  readonly actionError = signal<string | null>(null);
  readonly itemAction = signal<OrderItemActionState | null>(null);
  readonly orderAction = signal<OrderAction | null>(null);

  readonly totalUnits = computed(
    () => this.order()?.items.reduce(
      (total, item) => total + item.quantity,
      0
    ) ?? 0
  );

  readonly canEdit = computed(
    () => this.order()?.status === ORDER_STATUS.Pending
      && !this.isAnyOrderActionRunning()
  );

  readonly canStartPreparing = computed(
    () => this.order()?.status === ORDER_STATUS.Pending
  );

  readonly canMarkReady = computed(
    () => this.order()?.status === ORDER_STATUS.Preparing
  );

  readonly canDeliver = computed(
    () => this.order()?.status === ORDER_STATUS.Ready
  );

  readonly canCancel = computed(() => {
    const status = this.order()?.status;

    return status === ORDER_STATUS.Pending
      || status === ORDER_STATUS.Preparing
      || status === ORDER_STATUS.Ready;
  });

  initialize(orderId: number): void {
    this.orderId = orderId;
    this.loadOrder();
  }

  setInvalidOrderIdError(): void {
    this.error.set('El identificador de la orden no es válido.');
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

  addItem(
    value: OrderItemFormValue,
    onSuccess?: () => void
  ): void {
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
      .addItem(this.orderId, value)
      .pipe(
        finalize(() => this.addingItem.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: order => {
          this.order.set(order);
          onSuccess?.();
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

    if (quantity >= 1) {
      this.updateItem(itemId, quantity);
    }
  }

  removeItem(itemId: number): void {
    if (
      this.orderId === null ||
      !this.canEdit() ||
      this.itemAction() !== null ||
      !this.order()?.items.some(item => item.id === itemId)
    ) {
      return;
    }

    this.itemAction.set({ itemId, action: 'remove' });
    this.actionError.set(null);

    this.ordersApi
      .removeItem(this.orderId, itemId)
      .pipe(
        finalize(() => this.itemAction.set(null)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: order => this.order.set(order),
        error: (error: HttpErrorResponse) => {
          this.handleItemActionError(error);
        }
      });
  }

  performOrderAction(action: OrderAction): void {
    if (
      this.orderId === null ||
      this.isAnyOrderActionRunning() ||
      !this.isActionAllowed(action)
    ) {
      return;
    }

    this.orderAction.set(action);
    this.actionError.set(null);

    this.getOrderActionRequest(action)
      .pipe(
        finalize(() => this.orderAction.set(null)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: order => this.order.set(order),
        error: (error: HttpErrorResponse) => {
          this.handleOrderActionError(error);
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
    return current?.itemId === itemId && current.action === action;
  }

  isOrderActionRunning(action: OrderAction): boolean {
    return this.orderAction() === action;
  }

  isAnyOrderActionRunning(): boolean {
    return this.orderAction() !== null;
  }

  clearActionError(): void {
    this.actionError.set(null);
  }

  private updateItem(itemId: number, quantity: number): void {
    if (
      this.orderId === null ||
      !this.canEdit() ||
      this.itemAction() !== null
    ) {
      return;
    }

    const currentItem = this.order()?.items.find(
      item => item.id === itemId
    );

    if (!currentItem) {
      return;
    }

    this.itemAction.set({ itemId, action: 'update' });
    this.actionError.set(null);

    this.ordersApi
      .updateItem(this.orderId, itemId, {
        quantity,
        notes: currentItem.notes
      })
      .pipe(
        finalize(() => this.itemAction.set(null)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: order => this.order.set(order),
        error: (error: HttpErrorResponse) => {
          this.handleItemActionError(error);
        }
      });
  }

  private handleItemActionError(error: HttpErrorResponse): void {
    if (error.status === 404) {
      this.actionError.set('La orden o el producto ya no existe.');
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

  private getOrderActionRequest(action: OrderAction): Observable<Order> {
    if (this.orderId === null) {
      throw new Error('Order ID is required.');
    }

    switch (action) {
      case 'start-preparing':
        return this.ordersApi.startPreparing(this.orderId);
      case 'mark-ready':
        return this.ordersApi.markReady(this.orderId);
      case 'deliver':
        return this.ordersApi.deliver(this.orderId);
      case 'cancel':
        return this.ordersApi.cancel(this.orderId);
    }
  }

  private isActionAllowed(action: OrderAction): boolean {
    switch (action) {
      case 'start-preparing':
        return this.canStartPreparing();
      case 'mark-ready':
        return this.canMarkReady();
      case 'deliver':
        return this.canDeliver();
      case 'cancel':
        return this.canCancel();
    }
  }

  private handleOrderActionError(error: HttpErrorResponse): void {
    if (error.status === 404) {
      this.actionError.set('La orden ya no existe.');
      return;
    }

    if (error.status === 409) {
      this.actionError.set(
        'La orden cambió de estado y esta acción ya no está permitida.'
      );
      this.reloadOrder();
      return;
    }

    this.actionError.set(
      'No se pudo actualizar el estado de la orden. Intentá nuevamente.'
    );
  }

  private reloadOrder(): void {
    if (this.orderId === null) {
      return;
    }

    this.ordersApi
      .getById(this.orderId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: order => this.order.set(order),
        error: () => {
          this.actionError.set(
            'No se pudo volver a cargar la orden.'
          );
        }
      });
  }
}
