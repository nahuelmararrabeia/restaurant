import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  viewChild
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingState } from '../../../../shared/components/loading-state/loading-state';
import { ErrorState } from '../../../../shared/components/error-state/error-state';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SubsectionHeader } from '../../../../shared/components/subsection-header/subsection-header';
import { AddOrderItemForm } from '../../components/add-order-item-form/add-order-item-form';
import { OrderItemSummary } from '../../components/order-item-summary/order-item-summary';
import { OrderStatusCard } from '../../components/order-status-card/order-status-card';
import { OrderStatusBadge } from '../../components/order-status-badge/order-status-badge';
import { OrderSummaryCard } from '../../components/order-summary-card/order-summary-card';
import { OrderItemFormValue } from '../../models/order-item-form-value';
import {
  OrderAction,
  OrdersService
} from '../../services/orders-service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    DatePipe,
    OrderStatusBadge,
    AddOrderItemForm,
    OrderItemSummary,
    OrderStatusCard,
    OrderSummaryCard,
    LoadingState,
    ErrorState,
    EmptyState,
    SubsectionHeader
  ],
  providers: [OrdersService],
  templateUrl: './order-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ordersService = inject(OrdersService);

  readonly addItemForm = viewChild(AddOrderItemForm);

  readonly order = this.ordersService.order;
  readonly products = this.ordersService.products;
  readonly loading = this.ordersService.loading;
  readonly error = this.ordersService.error;
  readonly addingItem = this.ordersService.addingItem;
  readonly actionError = this.ordersService.actionError;
  readonly itemAction = this.ordersService.itemAction;
  readonly orderAction = this.ordersService.orderAction;
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

  clearActionError(): void {
    this.ordersService.clearActionError();
  }

  goBack(): void {
    void this.router.navigate(['/orders']);
  }
}
