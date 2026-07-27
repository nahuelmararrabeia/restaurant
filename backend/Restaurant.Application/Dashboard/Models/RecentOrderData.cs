using Restaurant.Domain.Enums;

namespace Restaurant.Application.Dashboard.Models
{
    public sealed record RecentOrderData(
    int Id,
    int TableNumber,
    OrderStatus Status,
    decimal Total,
    DateTime OrderedAt);
}
