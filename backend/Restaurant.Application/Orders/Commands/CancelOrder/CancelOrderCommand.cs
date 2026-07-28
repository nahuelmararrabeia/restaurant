using MediatR;
using Restaurant.Application.Orders.Responses;

namespace Restaurant.Application.Orders.Commands.CancelOrder;

public sealed record CancelOrderCommand(
    int Id,
    long Version) : IRequest<OrderDetailsResponse>;
