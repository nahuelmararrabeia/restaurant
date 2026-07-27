using MediatR;
using Restaurant.Application.Orders.Responses;
using Restaurant.Domain.Enums;

namespace Restaurant.Application.Orders.Queries.GetOrders;

public sealed record GetOrdersQuery(OrderStatus? Status = null)
    : IRequest<List<OrderResponse>>;