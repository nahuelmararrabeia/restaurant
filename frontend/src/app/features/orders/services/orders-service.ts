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
    this.error.set('The order ID is invalid.');
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
            'The order information could not be loaded.'
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
      this.order() === null ||
      this.addingItem() ||
      !this.canEdit()
    ) {
      return;
    }

    this.addingItem.set(true);
    this.actionError.set(null);

    this.ordersApi
      .addItem(this.orderId, {
        ...value,
        version: this.order()!.version
      })
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
              'The order can no longer be modified because its status changed.'
            );
            this.loadOrder();
            return;
          }

          if (error.status === 404) {
            this.actionError.set(
              'The order or selected product no longer exists.'
            );
            return;
          }

          this.actionError.set(
            'The product could not be added. Please try again.'
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

    const order = this.order();
    const item = order?.items.find(item => item.id === itemId);

    if (!order || !item) {
      this.itemAction.set(null);
      return;
    }

    this.ordersApi
      .removeItem(
        this.orderId,
        itemId,
        order.version,
        item.version
      )
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
        notes: currentItem.notes,
        version: this.order()!.version,
        itemVersion: currentItem.version
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
      this.actionError.set('The order or product no longer exists.');
      return;
    }

    if (error.status === 409) {
      this.actionError.set(
        'The order status changed and it can no longer be modified.'
      );
      return;
    }

    this.actionError.set(
      'The order could not be updated. Please try again.'
    );
  }

  private getOrderActionRequest(action: OrderAction): Observable<Order> {
    const order = this.order();

    if (this.orderId === null || order === null) {
      throw new Error('Order ID is required.');
    }

    switch (action) {
      case 'start-preparing':
        return this.ordersApi.startPreparing(
          this.orderId,
          order.version
        );
      case 'mark-ready':
        return this.ordersApi.markReady(this.orderId, order.version);
      case 'deliver':
        return this.ordersApi.deliver(this.orderId, order.version);
      case 'cancel':
        return this.ordersApi.cancel(this.orderId, order.version);
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
      this.actionError.set('The order no longer exists.');
      return;
    }

    if (error.status === 409) {
      this.actionError.set(
        'The order status changed and this action is no longer allowed.'
      );
      this.reloadOrder();
      return;
    }

    this.actionError.set(
      'The order status could not be updated. Please try again.'
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
            'The order could not be reloaded.'
          );
        }
      });
  }
}
