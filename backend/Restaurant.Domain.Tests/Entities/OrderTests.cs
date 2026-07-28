using Restaurant.Domain.Entities;
using Restaurant.Domain.Enums;
using Restaurant.Domain.Exceptions;

namespace Restaurant.Domain.Tests.Entities;

public sealed class OrderTests
{
    [Fact]
    public void New_order_is_pending_with_empty_items()
    {
        var order = new Order();

        Assert.Equal(OrderStatus.Pending, order.Status);
        Assert.Empty(order.Items);
        Assert.Equal(0, order.Total);
    }

    [Fact]
    public void Properties_preserve_relationship_and_audit_data()
    {
        var table = new Table(1, 4) { Id = 5 };
        var orderedAt = DateTime.UtcNow.AddHours(-1);
        var closedAt = DateTime.UtcNow;
        var items = new List<OrderItem>();
        var order = new Order
        {
            Id = 10,
            TableId = 5,
            Table = table,
            OrderedAt = orderedAt,
            ClosedAt = closedAt,
            Items = items,
            CreatedAt = orderedAt,
            CreatedBy = "test",
            UpdatedAt = closedAt,
            UpdatedBy = "test"
        };

        Assert.Equal(10, order.Id);
        Assert.Equal(5, order.TableId);
        Assert.Same(table, order.Table);
        Assert.Equal(orderedAt, order.OrderedAt);
        Assert.Equal(closedAt, order.ClosedAt);
        Assert.Same(items, order.Items);
        Assert.Equal(orderedAt, order.CreatedAt);
        Assert.Equal("test", order.CreatedBy);
        Assert.Equal(closedAt, order.UpdatedAt);
        Assert.Equal("test", order.UpdatedBy);
    }

    [Fact]
    public void AddItem_adds_new_item_and_recalculates_total()
    {
        var order = new Order();

        order.AddItem(10, 2, 500);

        var item = Assert.Single(order.Items);
        Assert.Equal(10, item.ProductId);
        Assert.Equal(2, item.Quantity);
        Assert.Equal(500, item.UnitPrice);
        Assert.Equal(1000, order.Total);
    }

    [Fact]
    public void AddItem_merges_same_product_and_recalculates_total()
    {
        var order = new Order();
        order.AddItem(10, 2, 500);

        order.AddItem(10, 3, 500);

        Assert.Equal(5, Assert.Single(order.Items).Quantity);
        Assert.Equal(2500, order.Total);
    }

    [Fact]
    public void AddItem_persists_normalized_notes()
    {
        var order = new Order();

        order.AddItem(10, 2, 500, "  No onions  ");

        Assert.Equal("No onions", Assert.Single(order.Items).Notes);
    }

    [Fact]
    public void AddItem_keeps_same_product_with_different_notes_separate()
    {
        var order = new Order();

        order.AddItem(10, 1, 500, "No onions");
        order.AddItem(10, 1, 500, "Extra onions");

        Assert.Equal(2, order.Items.Count);
    }

    [Fact]
    public void UpdateItemQuantity_changes_quantity_and_total()
    {
        var order = OrderWithItem();

        order.UpdateItem(1, 4);

        Assert.Equal(4, Assert.Single(order.Items).Quantity);
        Assert.Equal(2000, order.Total);
    }

    [Fact]
    public void UpdateItem_changes_quantity_and_notes()
    {
        var order = OrderWithItem();

        order.UpdateItem(1, 4, "  Well done  ");

        var item = Assert.Single(order.Items);
        Assert.Equal(4, item.Quantity);
        Assert.Equal("Well done", item.Notes);
    }

    [Fact]
    public void UpdateItemQuantity_rejects_unknown_item()
    {
        var order = new Order();

        Assert.Throws<BusinessException>(
            () => order.UpdateItem(99, 2));
    }

    [Fact]
    public void RemoveItem_removes_item_and_recalculates_total()
    {
        var order = OrderWithItem();

        order.RemoveItem(1);

        Assert.Empty(order.Items);
        Assert.Equal(0, order.Total);
    }

    [Fact]
    public void RemoveItem_rejects_unknown_item()
    {
        var order = new Order();

        Assert.Throws<BusinessException>(() => order.RemoveItem(99));
    }

    [Theory]
    [InlineData(OrderStatus.Delivered)]
    [InlineData(OrderStatus.Cancelled)]
    public void Closed_order_rejects_item_changes(OrderStatus status)
    {
        var order = OrderWithItem();
        order.Status = status;

        Assert.Throws<BusinessException>(() => order.AddItem(2, 1, 100));
        Assert.Throws<BusinessException>(
            () => order.UpdateItem(1, 2));
        Assert.Throws<BusinessException>(() => order.RemoveItem(1));
    }

    [Fact]
    public void Valid_status_flow_reaches_delivered_and_sets_closed_date()
    {
        var order = new Order();
        var before = DateTime.UtcNow;

        order.StartPreparing();
        Assert.Equal(OrderStatus.Preparing, order.Status);

        order.MarkReady();
        Assert.Equal(OrderStatus.Ready, order.Status);

        order.Deliver();

        Assert.Equal(OrderStatus.Delivered, order.Status);
        Assert.NotNull(order.ClosedAt);
        Assert.InRange(order.ClosedAt!.Value, before, DateTime.UtcNow);
    }

    [Fact]
    public void StartPreparing_rejects_non_pending_order()
    {
        var order = new Order { Status = OrderStatus.Preparing };

        Assert.Throws<BusinessException>(order.StartPreparing);
    }

    [Fact]
    public void MarkReady_rejects_non_preparing_order()
    {
        var order = new Order();

        Assert.Throws<BusinessException>(order.MarkReady);
    }

    [Fact]
    public void Deliver_rejects_non_ready_order()
    {
        var order = new Order();

        Assert.Throws<BusinessException>(order.Deliver);
    }

    [Fact]
    public void Cancel_closes_non_delivered_order()
    {
        var order = new Order();
        var before = DateTime.UtcNow;

        order.Cancel();

        Assert.Equal(OrderStatus.Cancelled, order.Status);
        Assert.InRange(order.ClosedAt!.Value, before, DateTime.UtcNow);
    }

    [Fact]
    public void Cancel_rejects_delivered_order()
    {
        var order = new Order { Status = OrderStatus.Delivered };

        Assert.Throws<BusinessException>(order.Cancel);
    }

    private static Order OrderWithItem()
    {
        var order = new Order();
        order.Items.Add(new OrderItem
        {
            Id = 1,
            ProductId = 10,
            Quantity = 2,
            UnitPrice = 500
        });
        order.Total = 1000;
        return order;
    }
}
