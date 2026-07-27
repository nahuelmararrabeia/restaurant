using MediatR;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Application.Orders.Responses;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Orders.Queries.GetOrderById;

public sealed class GetOrderByIdQueryHandler
    : IRequestHandler<GetOrderByIdQuery, OrderDetailsResponse>
{
    private readonly IOrderRepository _orderRepository;

    public GetOrderByIdQueryHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<OrderDetailsResponse> Handle(
        GetOrderByIdQuery request,
        CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetByIdWithDetailsAsync(
            request.Id,
            cancellationToken);

        if (order is null)
            throw new NotFoundException($"Order {request.Id} was not found.");

        var items = order.Items.Select(x => new OrderItemResponse(
            x.Id,
            x.ProductId,
            x.Product?.Name ?? string.Empty,
            x.Quantity,
            x.UnitPrice,
            x.SubTotal)).ToList();

        return new OrderDetailsResponse(
            order.Id,
            order.TableId,
            order.Status,
            order.OrderedAt,
            order.ClosedAt,
            order.Total,
            items);
    }
}