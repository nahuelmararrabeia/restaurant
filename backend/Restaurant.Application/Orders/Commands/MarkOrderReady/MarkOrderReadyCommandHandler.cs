using MediatR;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Application.Orders.Mappings;
using Restaurant.Application.Orders.Responses;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Orders.Commands.MarkOrderReady;

public sealed class MarkOrderReadyCommandHandler
    : IRequestHandler<MarkOrderReadyCommand, OrderDetailsResponse>
{
    private readonly IOrderRepository _orderRepository;

    public MarkOrderReadyCommandHandler(
        IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<OrderDetailsResponse> Handle(
        MarkOrderReadyCommand request,
        CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetByIdWithDetailsAsync(
            request.Id,
            cancellationToken);

        if (order is null)
            throw new NotFoundException($"Order {request.Id} was not found.");

        order.MarkReady();

        await _orderRepository.SaveChangesAsync(cancellationToken);

        return order.ToDetailsResponse();
    }
}