namespace Restaurant.Application.Dashboard.Models
{
    public sealed record DashboardData(
    int ProductsCount,
    int TablesCount,
    int ActiveOrdersCount,
    decimal Revenue,
    IReadOnlyList<DashboardTableData> Tables,
    IReadOnlyList<RecentOrderData> RecentOrders);
}
