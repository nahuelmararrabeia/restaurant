using Restaurant.Domain.Enums;

namespace Restaurant.Application.Orders.Responses;

public sealed record OrderDetailsResponse(
    int Id,
    int TableId,
    OrderStatus Status,
    DateTime OrderedAt,
    DateTime? ClosedAt,
    decimal Total,
    IReadOnlyCollection<OrderItemResponse> Items);