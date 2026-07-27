using MediatR;
using Restaurant.Application.Orders.Responses;

namespace Restaurant.Application.Orders.Commands.RemoveOrderItem;

public sealed record RemoveOrderItemCommand(
    int OrderId,
    int OrderItemId) : IRequest<OrderDetailsResponse>;