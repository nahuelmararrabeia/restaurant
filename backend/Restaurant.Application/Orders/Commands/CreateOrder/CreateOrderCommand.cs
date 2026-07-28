using MediatR;

namespace Restaurant.Application.Orders.Commands.CreateOrder;

public sealed record CreateOrderCommand(
    int TableId,
    long TableVersion) : IRequest<int>;
