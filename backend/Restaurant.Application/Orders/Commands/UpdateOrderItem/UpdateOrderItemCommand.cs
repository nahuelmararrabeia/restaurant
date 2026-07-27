using MediatR;
using Restaurant.Application.Orders.Responses;

namespace Restaurant.Application.Orders.Commands.UpdateOrderItem
{
    public sealed record UpdateOrderItemCommand(
    int OrderId,
    int ItemId,
    int Quantity) : IRequest<OrderDetailsResponse>;
}
