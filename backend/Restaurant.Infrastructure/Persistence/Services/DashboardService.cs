using Microsoft.EntityFrameworkCore;
using Restaurant.Application.Dashboard;
using Restaurant.Application.Dashboard.Models;
using Restaurant.Domain.Enums;

namespace Restaurant.Infrastructure.Persistence.Services
{
    public sealed class DashboardService : IDashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(
            AppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardData> GetAsync(
            DateTime from,
            DateTime to,
            int recentOrdersCount,
            CancellationToken cancellationToken)
        {
            var productsCount = await _context.Products
                .AsNoTracking()
                .CountAsync(cancellationToken);

            var tablesCount = await _context.Tables
                .AsNoTracking()
                .CountAsync(cancellationToken);

            var activeOrdersCount = await _context.Orders
                .AsNoTracking()
                .CountAsync(
                    order =>
                        order.Status != OrderStatus.Delivered &&
                        order.Status != OrderStatus.Cancelled,
                    cancellationToken);

            var revenue = await _context.Orders
                .AsNoTracking()
                .Where(order =>
                    order.Status == OrderStatus.Delivered &&
                    order.ClosedAt >= from &&
                    order.ClosedAt < to)
                .SumAsync(
                    order => (decimal?)order.Total,
                    cancellationToken)
                ?? 0m;

            var tables = await _context.Tables
                .AsNoTracking()
                .OrderBy(table => table.Number)
                .Select(table => new DashboardTableData(
                    table.Id,
                    table.Number,
                    table.Capacity,
                    table.Status))
                .ToListAsync(cancellationToken);

            var recentOrders = await _context.Orders
                .AsNoTracking()
                .OrderByDescending(order => order.OrderedAt)
                .Take(recentOrdersCount)
                .Select(order => new RecentOrderData(
                    order.Id,
                    order.Table!.Number,
                    order.Status,
                    order.Total,
                    order.OrderedAt))
                .ToListAsync(cancellationToken);

            return new DashboardData(
                productsCount,
                tablesCount,
                activeOrdersCount,
                revenue,
                tables,
                recentOrders);
        }
    }
}
