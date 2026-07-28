using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Domain.Entities;
using Restaurant.Domain.Enums;
using Restaurant.Infrastructure.Persistence;
using Xunit;

namespace Restaurant.Infrastructure.Tests.Persistence;

public sealed class ActiveOrderConstraintTests
{
    [Fact]
    public async Task SaveChanges_rejects_second_active_order_for_same_table()
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        await using var connection = new SqliteConnection(
            "Data Source=:memory:");
        await connection.OpenAsync(cancellationToken);
        var options = CreateOptions(connection);

        await using (var setup = new AppDbContext(options))
        {
            await setup.Database.EnsureCreatedAsync(cancellationToken);
            setup.Tables.Add(new Table(1, 4) { Id = 1 });
            setup.Orders.Add(CreateOrder(1, OrderStatus.Pending));
            await setup.SaveChangesAsync(cancellationToken);
        }

        await using var competingContext = new AppDbContext(options);
        competingContext.Orders.Add(
            CreateOrder(1, OrderStatus.Preparing));

        await Assert.ThrowsAsync<ConflictException>(
            () => competingContext.SaveChangesAsync(cancellationToken));
    }

    [Fact]
    public async Task SaveChanges_allows_new_order_after_previous_one_is_closed()
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        await using var connection = new SqliteConnection(
            "Data Source=:memory:");
        await connection.OpenAsync(cancellationToken);
        var options = CreateOptions(connection);

        await using (var setup = new AppDbContext(options))
        {
            await setup.Database.EnsureCreatedAsync(cancellationToken);
            setup.Tables.Add(new Table(1, 4) { Id = 1 });
            setup.Orders.Add(CreateOrder(1, OrderStatus.Delivered));
            await setup.SaveChangesAsync(cancellationToken);
        }

        await using var nextContext = new AppDbContext(options);
        nextContext.Orders.Add(CreateOrder(1, OrderStatus.Pending));

        await nextContext.SaveChangesAsync(cancellationToken);

        Assert.Equal(
            2,
            await nextContext.Orders.CountAsync(cancellationToken));
    }

    private static DbContextOptions<AppDbContext> CreateOptions(
        SqliteConnection connection)
    {
        return new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(connection)
            .Options;
    }

    private static Order CreateOrder(
        int tableId,
        OrderStatus status)
    {
        return new Order
        {
            TableId = tableId,
            Status = status,
            OrderedAt = DateTime.UtcNow
        };
    }
}
