using Restaurant.Domain.Entities;

namespace Restaurant.Domain.Tests.Entities;

public sealed class OrderItemTests
{
    [Theory]
    [InlineData(1, 100, 100)]
    [InlineData(3, 125.50, 376.50)]
    [InlineData(0, 900, 0)]
    public void SubTotal_multiplies_quantity_by_unit_price(
        int quantity,
        double unitPrice,
        double expected)
    {
        var item = new OrderItem
        {
            Quantity = quantity,
            UnitPrice = (decimal)unitPrice
        };

        Assert.Equal((decimal)expected, item.SubTotal);
    }

    [Fact]
    public void Properties_preserve_relationships_and_audit_data()
    {
        var order = new Order { Id = 2 };
        var product = new Product { Id = 3 };
        var createdAt = DateTime.UtcNow.AddMinutes(-5);
        var updatedAt = DateTime.UtcNow;

        var item = new OrderItem
        {
            Id = 1,
            OrderId = 2,
            Order = order,
            ProductId = 3,
            Product = product,
            Quantity = 2,
            UnitPrice = 100,
            CreatedAt = createdAt,
            CreatedBy = "test",
            UpdatedAt = updatedAt,
            UpdatedBy = "test"
        };

        Assert.Equal(1, item.Id);
        Assert.Equal(2, item.OrderId);
        Assert.Same(order, item.Order);
        Assert.Equal(3, item.ProductId);
        Assert.Same(product, item.Product);
        Assert.Equal(createdAt, item.CreatedAt);
        Assert.Equal("test", item.CreatedBy);
        Assert.Equal(updatedAt, item.UpdatedAt);
        Assert.Equal("test", item.UpdatedBy);
    }
}
