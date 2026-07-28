using MediatR;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Application.Orders.Mappings;
using Restaurant.Application.Orders.Responses;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Orders.Commands.StartPreparingOrder;

public sealed class StartPreparingOrderCommandHandler
    : IRequestHandler<StartPreparingOrderCommand, OrderDetailsResponse>
{
    private readonly IOrderRepository _orderRepository;

    public StartPreparingOrderCommandHandler(
        IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<OrderDetailsResponse> Handle(
        StartPreparingOrderCommand request,
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

        order.StartPreparing();

        await _orderRepository.SaveChangesAsync(cancellationToken);

        return order.ToDetailsResponse();
    }
}
