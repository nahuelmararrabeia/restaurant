namespace Restaurant.Application.Dashboard.Responses
{
    public sealed record DashboardStatisticsResponse(
    int Products,
    int Tables,
    int ActiveOrders,
    decimal TodayRevenue);
}
