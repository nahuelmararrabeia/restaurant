using MediatR;
using Restaurant.Application.Orders.Mappings;
using Restaurant.Application.Orders.Responses;
using Restaurant.Domain.Entities;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Orders.Queries.GetOrders;

public sealed class GetOrdersQueryHandler
    : IRequestHandler<GetOrdersQuery, List<OrderResponse>>
{
    private readonly IOrderRepository _orderRepository;

    public GetOrdersQueryHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<List<OrderResponse>> Handle(
        GetOrdersQuery request,
        CancellationToken cancellationToken)
    {
        var orders = request.Status is null
            ? await _orderRepository.GetAllAsync(cancellationToken)
            : await _orderRepository.GetByStatusAsync(request.Status.Value, cancellationToken);

        return orders
            .Select(order => order.ToResponse())
            .ToList();
    }
}