using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Domain.Entities;
using Restaurant.Infrastructure.Persistence;
using Xunit;

namespace Restaurant.Infrastructure.Tests.Persistence;

public sealed class OptimisticConcurrencyTests
{
    [Fact]
    public void Model_configures_version_as_concurrency_token_for_all_entities()
    {
        using var context = new AppDbContext(
            new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlite("Data Source=:memory:")
                .Options);

        var entityTypes = new[]
        {
            typeof(Order),
            typeof(OrderItem),
            typeof(Table),
            typeof(Product)
        };

        foreach (var entityType in entityTypes)
        {
            var version = context.Model.FindEntityType(entityType)
                ?.FindProperty(nameof(Product.Version));

            Assert.NotNull(version);
            Assert.True(version.IsConcurrencyToken);
        }
    }

    [Fact]
    public async Task SaveChanges_rejects_stale_update()
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
            setup.Products.Add(new Product
            {
                Name = "Coffee",
                Price = 1000
            });
            await setup.SaveChangesAsync(cancellationToken);

            Assert.Equal(1, setup.Products.Single().Version);
        }

        await using var firstContext = new AppDbContext(options);
        await using var staleContext = new AppDbContext(options);
        var firstProduct = await firstContext.Products.SingleAsync(
            cancellationToken);
        var staleProduct = await staleContext.Products.SingleAsync(
            cancellationToken);

        firstProduct.Update("Coffee", null, 1200);
        await firstContext.SaveChangesAsync(cancellationToken);

        Assert.Equal(2, firstProduct.Version);

        staleProduct.Update("Coffee", null, 1300);
        var exception = await Assert.ThrowsAsync<ConflictException>(
            () => staleContext.SaveChangesAsync(cancellationToken));

        Assert.Equal(
            "The resource was modified by another operation. Reload it and try again.",
            exception.Message);
    }
}
