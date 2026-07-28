using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Domain.Entities;
using Restaurant.Infrastructure.Persistence;
using Xunit;

namespace Restaurant.Infrastructure.Tests.Persistence;

public sealed class IdempotencyConstraintTests
{
    [Fact]
    public async Task SaveChanges_rejects_duplicate_key_for_same_operation()
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        await using var connection = new SqliteConnection(
            "Data Source=:memory:");
        await connection.OpenAsync(cancellationToken);
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(connection)
            .Options;

        await using (var setup = new AppDbContext(options))
        {
            await setup.Database.EnsureCreatedAsync(cancellationToken);
            setup.Tables.Add(new Table(1, 4) { Id = 1 });
            setup.Orders.Add(new Order { Id = 1, TableId = 1 });
            setup.IdempotencyRecords.Add(
                Record("orders:create", "same-key"));
            await setup.SaveChangesAsync(cancellationToken);
        }

        await using var competingContext = new AppDbContext(options);
        competingContext.IdempotencyRecords.Add(
            Record("orders:create", "same-key"));

        await Assert.ThrowsAsync<ConflictException>(
            () => competingContext.SaveChangesAsync(cancellationToken));
    }

    [Fact]
    public async Task SaveChanges_allows_same_key_for_different_operations()
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        await using var connection = new SqliteConnection(
            "Data Source=:memory:");
        await connection.OpenAsync(cancellationToken);
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(connection)
            .Options;

        await using var context = new AppDbContext(options);
        await context.Database.EnsureCreatedAsync(cancellationToken);
        context.Tables.Add(new Table(1, 4) { Id = 1 });
        context.Orders.Add(new Order { Id = 1, TableId = 1 });
        context.IdempotencyRecords.AddRange(
            Record("orders:create", "same-key"),
            Record("orders:add-item", "same-key"));

        await context.SaveChangesAsync(cancellationToken);

        Assert.Equal(
            2,
            await context.IdempotencyRecords.CountAsync(
                cancellationToken));
    }

    private static IdempotencyRecord Record(
        string operation,
        string key)
    {
        return new IdempotencyRecord
        {
            Operation = operation,
            Key = key,
            RequestHash = new string('A', 64),
            OrderId = 1,
            CreatedAt = DateTime.UtcNow
        };
    }
}
