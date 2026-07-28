using NSubstitute;
using Restaurant.Application.Dashboard;
using Restaurant.Application.Dashboard.Models;
using Restaurant.Application.Dashboard.Queries.GetDashboard;
using Restaurant.Domain.Enums;

namespace Restaurant.Application.Tests.Dashboard;

public sealed class DashboardHandlerTests
{
    [Fact]
    public async Task GetDashboard_maps_service_data()
    {
        var service = Substitute.For<IDashboardService>();
        service.GetAsync(
                Arg.Any<DateTime>(),
                Arg.Any<DateTime>(),
                5,
                Arg.Any<CancellationToken>())
            .Returns(new DashboardData(
                3,
                4,
                2,
                5000,
                [new DashboardTableData(1, 1, 4, TableStatus.Available)],
                [new RecentOrderData(2, 1, OrderStatus.Pending, 5000, DateTime.UtcNow)]));

        var result = await new GetDashboardQueryHandler(service).Handle(
            new GetDashboardQuery(), CancellationToken.None);

        Assert.Equal(3, result.Statistics.Products);
        Assert.Single(result.Tables);
        Assert.Single(result.RecentOrders);
    }
}
