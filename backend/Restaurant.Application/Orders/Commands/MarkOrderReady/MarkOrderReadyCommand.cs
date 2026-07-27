using MediatR;

namespace Restaurant.Application.Orders.Commands.MarkOrderReady;

public sealed record MarkOrderReadyCommand(int Id) : IRequest;