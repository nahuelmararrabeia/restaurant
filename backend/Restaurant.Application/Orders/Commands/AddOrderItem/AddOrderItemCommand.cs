using MediatR;
using Restaurant.Application.Orders.Responses;

namespace Restaurant.Application.Orders.Commands.AddOrderItem;

public sealed record AddOrderItemCommand(
    int OrderId,
    int ProductId,
    int Quantity,
    string? Notes = null) : IRequest<OrderDetailsResponse>;
