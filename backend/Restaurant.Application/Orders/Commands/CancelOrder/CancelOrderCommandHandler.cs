using MediatR;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Application.Orders.Mappings;
using Restaurant.Application.Orders.Responses;
using Restaurant.Domain.Enums;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Orders.Commands.CancelOrder;

public sealed class CancelOrderCommandHandler
    : IRequestHandler<CancelOrderCommand, OrderDetailsResponse>
{
    private readonly IOrderRepository _orderRepository;
    private readonly ITableRepository _tableRepository;

    public CancelOrderCommandHandler(
        IOrderRepository orderRepository,
        ITableRepository tableRepository)
    {
        _orderRepository = orderRepository;
        _tableRepository = tableRepository;
    }

    public async Task<OrderDetailsResponse> Handle(
        CancelOrderCommand request,
        CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetByIdWithDetailsAsync(
            request.Id,
            cancellationToken);

        if (order is null)
            throw new NotFoundException($"Order {request.Id} was not found.");

        var table = await _tableRepository.GetByIdAsync(
            order.TableId,
            cancellationToken);

        if (table is null)
            throw new NotFoundException($"Table {order.TableId} was not found.");

        order.Cancel();

        if (table.Status == TableStatus.Occupied)
        {
            table.Release();
        }

        await _orderRepository.SaveChangesAsync(cancellationToken);

        return order.ToDetailsResponse();
    }
}