using MediatR;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Application.Orders.Mappings;
using Restaurant.Application.Orders.Responses;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Orders.Commands.UpdateOrderItem;

public sealed class UpdateOrderItemCommandHandler
    : IRequestHandler<UpdateOrderItemCommand, OrderDetailsResponse>
{
    private readonly IOrderRepository _orderRepository;

    public UpdateOrderItemCommandHandler(
        IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<OrderDetailsResponse> Handle(
        UpdateOrderItemCommand request,
        CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetByIdWithDetailsAsync(
            request.OrderId,
            cancellationToken);

        if (order is null)
            throw new NotFoundException($"Order {request.OrderId} was not found.");

        Restaurant.Application.Common.ConcurrencyGuard.EnsureVersion(
            order,
            request.Version);

        var item = order.Items.FirstOrDefault(
            item => item.Id == request.ItemId);

        if (item is null)
            throw new NotFoundException(
                $"Order item {request.ItemId} was not found.");

        Restaurant.Application.Common.ConcurrencyGuard.EnsureVersion(
            item,
            request.ItemVersion);

        order.UpdateItem(
            request.ItemId,
            request.Quantity,
            request.Notes);

        await _orderRepository.SaveChangesAsync(cancellationToken);

        return order.ToDetailsResponse();
    }
}
