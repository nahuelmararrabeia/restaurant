using Restaurant.Domain.Enums;

namespace Restaurant.Application.Orders.Responses;

public sealed record OrderResponse(
    int Id,
    int TableId,
    int TableNumber,
    OrderStatus Status,
    DateTime OrderedAt,
    DateTime? ClosedAt,
    List<OrderItemResponse> Items,
    decimal Total);