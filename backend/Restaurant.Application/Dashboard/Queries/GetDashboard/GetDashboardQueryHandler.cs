using MediatR;
using Restaurant.Application.Dashboard.Responses;

namespace Restaurant.Application.Dashboard.Queries.GetDashboard
{
    public sealed class GetDashboardQueryHandler
    : IRequestHandler<GetDashboardQuery, DashboardResponse>
    {
        private readonly IDashboardService _dashboardService;

        public GetDashboardQueryHandler(
            IDashboardService dashboardQuery)
        {
            _dashboardService = dashboardQuery;
        }

        public async Task<DashboardResponse> Handle(
            GetDashboardQuery request,
            CancellationToken cancellationToken)
        {
            var today = DateTime.UtcNow.Date;
            var tomorrow = today.AddDays(1);

            var dashboard = await _dashboardService.GetAsync(
                today,
                tomorrow,
                recentOrdersCount: 5,
                cancellationToken);

            return new DashboardResponse(
                new DashboardStatisticsResponse(
                    dashboard.ProductsCount,
                    dashboard.TablesCount,
                    dashboard.ActiveOrdersCount,
                    dashboard.Revenue),
                dashboard.Tables
                    .Select(table => new DashboardTableResponse(
                        table.Id,
                        table.Number,
                        table.Capacity,
                        table.Status))
                    .ToList(),
                dashboard.RecentOrders
                    .Select(order => new RecentOrderResponse(
                        order.Id,
                        order.TableNumber,
                        order.Status,
                        order.Total,
                        order.OrderedAt))
                    .ToList());
        }
    }
}
