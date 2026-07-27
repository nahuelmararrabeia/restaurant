using MediatR;
using Restaurant.Application.Orders.Responses;
using Restaurant.Domain.Enums;

namespace Restaurant.Application.Orders.Queries.GetOrders;

public sealed record GetOrdersQuery(
    OrderStatus? Status = null,
    int Page = 1,
    int PageSize = 9)
    : IRequest<PagedOrdersResponse>;
