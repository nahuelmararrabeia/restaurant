using MediatR;

namespace Restaurant.Application.Orders.Commands.AddOrderItem;

public sealed record AddOrderItemCommand(
    int OrderId,
    int ProductId,
    int Quantity) : IRequest;