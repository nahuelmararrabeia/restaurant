using MediatR;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Orders.Commands.StartPreparingOrder;

public sealed class StartPreparingOrderCommandHandler
    : IRequestHandler<StartPreparingOrderCommand>
{
    private readonly IOrderRepository _orderRepository;

    public StartPreparingOrderCommandHandler(
        IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task Handle(
        StartPreparingOrderCommand request,
        CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (order is null)
            throw new NotFoundException($"Order {request.Id} was not found.");

        order.StartPreparing();

        await _orderRepository.SaveChangesAsync(cancellationToken);
    }
}