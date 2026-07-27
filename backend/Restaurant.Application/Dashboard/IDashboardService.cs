using Restaurant.Application.Dashboard.Models;

namespace Restaurant.Application.Dashboard
{
    public interface IDashboardService
    {
        Task<DashboardData> GetAsync(
        DateTime from,
        DateTime to,
        int recentOrdersCount,
        CancellationToken cancellationToken);
    }
}
