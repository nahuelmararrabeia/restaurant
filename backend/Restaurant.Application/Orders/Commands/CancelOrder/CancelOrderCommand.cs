using MediatR;

namespace Restaurant.Application.Orders.Commands.CancelOrder;

public sealed record CancelOrderCommand(int Id) : IRequest;