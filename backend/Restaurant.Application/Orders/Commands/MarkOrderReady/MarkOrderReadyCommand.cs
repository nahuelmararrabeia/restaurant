using MediatR;
using Restaurant.Application.Orders.Responses;

namespace Restaurant.Application.Orders.Commands.MarkOrderReady;

public sealed record MarkOrderReadyCommand(int Id) : IRequest<OrderDetailsResponse>;