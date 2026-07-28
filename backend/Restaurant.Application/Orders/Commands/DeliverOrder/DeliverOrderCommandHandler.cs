using MediatR;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Application.Orders.Mappings;
using Restaurant.Application.Orders.Responses;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Orders.Commands.DeliverOrder;

public sealed class DeliverOrderCommandHandler
    : IRequestHandler<DeliverOrderCommand, OrderDetailsResponse>
{
    private readonly IOrderRepository _orderRepository;
    private readonly ITableRepository _tableRepository;

    public DeliverOrderCommandHandler(
        IOrderRepository orderRepository,
        ITableRepository tableRepository)
    {
        _orderRepository = orderRepository;
        _tableRepository = tableRepository;
    }

    public async Task<OrderDetailsResponse> Handle(
        DeliverOrderCommand request,
        CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetByIdWithDetailsAsync(
            request.Id,
            cancellationToken);

        if (order is null)
            throw new NotFoundException($"Order {request.Id} was not found.");

        Restaurant.Application.Common.ConcurrencyGuard.EnsureVersion(
            order,
            request.Version);

        var table = await _tableRepository.GetByIdAsync(
            order.TableId,
            cancellationToken);

        if (table is null)
            throw new NotFoundException($"Table {order.TableId} was not found.");

        order.Deliver();

        table.Release();

        await _orderRepository.SaveChangesAsync(cancellationToken);

        return order.ToDetailsResponse();
    }
}
