using MediatR;
using Restaurant.Application.Orders.Responses;

namespace Restaurant.Application.Orders.Commands.StartPreparingOrder;

public sealed record StartPreparingOrderCommand(
    int Id,
    long Version) : IRequest<OrderDetailsResponse>;
