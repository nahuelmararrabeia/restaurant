using MediatR;

namespace Restaurant.Application.Orders.Commands.DeliverOrder;

public sealed record DeliverOrderCommand(int Id) : IRequest;