using MediatR;

namespace Restaurant.Application.Orders.Commands.StartPreparingOrder;

public sealed record StartPreparingOrderCommand(int Id) : IRequest;