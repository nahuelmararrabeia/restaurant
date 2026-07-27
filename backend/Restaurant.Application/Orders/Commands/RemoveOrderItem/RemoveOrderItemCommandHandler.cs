using MediatR;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Orders.Commands.RemoveOrderItem;

public sealed class RemoveOrderItemCommandHandler
    : IRequestHandler<RemoveOrderItemCommand>
{
    private readonly IOrderRepository _orderRepository;

    public RemoveOrderItemCommandHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task Handle(
        RemoveOrderItemCommand request,
        CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetByIdWithDetailsAsync(
            request.OrderId,
            cancellationToken);

        if (order is null)
            throw new NotFoundException($"Order {request.OrderId} was not found.");

        order.RemoveItem(request.OrderItemId);

        await _orderRepository.SaveChangesAsync(cancellationToken);
    }
}