namespace Restaurant.Application.Dashboard.Responses;

public sealed record DashboardResponse(
    DashboardStatisticsResponse Statistics,
    List<DashboardTableResponse> Tables,
    List<RecentOrderResponse> RecentOrders);