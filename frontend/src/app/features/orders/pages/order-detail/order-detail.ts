import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  viewChild
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ORDER_STATUS } from '../../../../shared/domain/orders/order-status';
import { LoadingState } from '../../../../shared/components/loading-state/loading-state';
import { ErrorState } from '../../../../shared/components/error-state/error-state';
import { AddOrderItemForm } from '../../components/add-order-item-form/add-order-item-form';
import { OrderStatusBadge } from '../../components/order-status-badge/order-status-badge';
import { OrderItemFormValue } from '../../models/order-item-form-value';
import {
  OrderAction,
  OrderItemAction,
  OrdersService
} from '../../services/orders-service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
    OrderStatusBadge,
    AddOrderItemForm,
    LoadingState,
    ErrorState
  ],
  providers: [OrdersService],
  templateUrl: './order-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly ordersService = inject(OrdersService);

  readonly addItemForm = viewChild(AddOrderItemForm);
  readonly ORDER_STATUS = ORDER_STATUS;

  readonly order = this.ordersService.order;
  readonly products = this.ordersService.products;
  readonly loading = this.ordersService.loading;
  readonly error = this.ordersService.error;
  readonly addingItem = this.ordersService.addingItem;
  readonly actionError = this.ordersService.actionError;
  readonly totalUnits = this.ordersService.totalUnits;
  readonly canEdit = this.ordersService.canEdit;
  readonly canStartPreparing = this.ordersService.canStartPreparing;
  readonly canMarkReady = this.ordersService.canMarkReady;
  readonly canDeliver = this.ordersService.canDeliver;
  readonly canCancel = this.ordersService.canCancel;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.ordersService.setInvalidOrderIdError();
      return;
    }

    this.ordersService.initialize(id);
  }

  loadOrder(): void {
    this.ordersService.loadOrder();
  }

  addItem(value: OrderItemFormValue): void {
    this.ordersService.addItem(
      value,
      () => this.addItemForm()?.reset()
    );
  }

  changeItemQuantity(
    itemId: number,
    currentQuantity: number,
    delta: number
  ): void {
    this.ordersService.changeItemQuantity(
      itemId,
      currentQuantity,
      delta
    );
  }

  removeItem(itemId: number): void {
    const item = this.order()?.items.find(
      current => current.id === itemId
    );

    if (
      item &&
      window.confirm(`¿Eliminar "${item.productName}" de la orden?`)
    ) {
      this.ordersService.removeItem(itemId);
    }
  }

  performOrderAction(action: OrderAction): void {
    if (
      action !== 'cancel' ||
      window.confirm('¿Confirmás que querés cancelar esta orden?')
    ) {
      this.ordersService.performOrderAction(action);
    }
  }

  isItemBusy(itemId: number): boolean {
    return this.ordersService.isItemBusy(itemId);
  }

  isItemActionRunning(
    itemId: number,
    action: OrderItemAction
  ): boolean {
    return this.ordersService.isItemActionRunning(itemId, action);
  }

  isOrderActionRunning(action: OrderAction): boolean {
    return this.ordersService.isOrderActionRunning(action);
  }

  isAnyOrderActionRunning(): boolean {
    return this.ordersService.isAnyOrderActionRunning();
  }

  clearActionError(): void {
    this.ordersService.clearActionError();
  }
}
