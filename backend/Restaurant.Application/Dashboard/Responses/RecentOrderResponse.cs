using Restaurant.Domain.Enums;

namespace Restaurant.Application.Dashboard.Responses
{
    public sealed record RecentOrderResponse(
    int Id,
    int TableNumber,
    OrderStatus Status,
    decimal Total,
    DateTime OrderedAt);
}
