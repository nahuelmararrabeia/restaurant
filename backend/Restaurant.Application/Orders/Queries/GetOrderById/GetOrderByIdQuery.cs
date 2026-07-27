using MediatR;
using Restaurant.Application.Orders.Responses;

namespace Restaurant.Application.Orders.Queries.GetOrderById;

public sealed record GetOrderByIdQuery(int Id) : IRequest<OrderDetailsResponse>;