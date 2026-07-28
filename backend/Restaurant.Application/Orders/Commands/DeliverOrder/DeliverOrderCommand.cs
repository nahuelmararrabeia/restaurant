using MediatR;
using Restaurant.Application.Orders.Responses;

namespace Restaurant.Application.Orders.Commands.DeliverOrder;

public sealed record DeliverOrderCommand(
    int Id,
    long Version) : IRequest<OrderDetailsResponse>;
