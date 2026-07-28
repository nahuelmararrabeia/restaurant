using MediatR;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Domain.Entities;
using Restaurant.Domain.Enums;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Orders.Commands.CreateOrder;

public sealed class CreateOrderCommandHandler
    : IRequestHandler<CreateOrderCommand, int>
{
    private readonly IOrderRepository _orderRepository;
    private readonly ITableRepository _tableRepository;

    public CreateOrderCommandHandler(
        IOrderRepository orderRepository,
        ITableRepository tableRepository)
    {
        _orderRepository = orderRepository;
        _tableRepository = tableRepository;
    }

    public async Task<int> Handle(
        CreateOrderCommand request,
        CancellationToken cancellationToken)
    {
        var table = await _tableRepository.GetByIdAsync(request.TableId, cancellationToken);

        if (table is null)
            throw new NotFoundException($"Table {request.TableId} was not found.");

        Restaurant.Application.Common.ConcurrencyGuard.EnsureVersion(
            table,
            request.TableVersion);

        if (table.Status is TableStatus.Disabled)
            throw new BusinessException("Cannot create an order for a disabled table.");

        var openOrder = await _orderRepository.GetOpenByTableIdAsync(
            request.TableId,
            cancellationToken);

        if (openOrder is not null)
            throw new ConflictException($"Table {request.TableId} already has an open order.");

        var order = new Order
        {
            TableId = request.TableId,
            Status = OrderStatus.Pending,
            OrderedAt = DateTime.UtcNow
        };

        table.Occupy();

        await _orderRepository.AddAsync(order, cancellationToken);
        try
        {
            await _orderRepository.SaveChangesAsync(cancellationToken);
        }
        catch (ConflictException)
        {
            throw new ConflictException(
                $"Table {request.TableId} already has an open order.");
        }

        return order.Id;
    }
}
