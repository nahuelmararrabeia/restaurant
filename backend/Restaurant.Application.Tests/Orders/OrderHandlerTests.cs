using NSubstitute;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Application.Orders.Commands.AddOrderItem;
using Restaurant.Application.Orders.Commands.CancelOrder;
using Restaurant.Application.Orders.Commands.CreateOrder;
using Restaurant.Application.Orders.Commands.DeliverOrder;
using Restaurant.Application.Orders.Commands.MarkOrderReady;
using Restaurant.Application.Orders.Commands.RemoveOrderItem;
using Restaurant.Application.Orders.Commands.StartPreparingOrder;
using Restaurant.Application.Orders.Commands.UpdateOrderItem;
using Restaurant.Application.Orders.Queries.GetOrderById;
using Restaurant.Application.Orders.Queries.GetOrders;
using Restaurant.Domain.Entities;
using Restaurant.Domain.Enums;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Tests.Orders;

public sealed class OrderHandlerTests
{
    private readonly IOrderRepository _orders =
        Substitute.For<IOrderRepository>();
    private readonly ITableRepository _tables =
        Substitute.For<ITableRepository>();
    private readonly IProductRepository _products =
        Substitute.For<IProductRepository>();

    [Fact]
    public async Task Create_persists_order_and_occupies_table()
    {
        var table = new Table(1, 4) { Id = 1, Version = 1 };
        _tables.GetByIdAsync(1, Arg.Any<CancellationToken>()).Returns(table);
        _orders.GetOpenByTableIdAsync(1, Arg.Any<CancellationToken>())
            .Returns((Order?)null);

        await new CreateOrderCommandHandler(_orders, _tables).Handle(
            new CreateOrderCommand(1, 1), CancellationToken.None);

        Assert.Equal(TableStatus.Occupied, table.Status);
        await _orders.Received(1).AddAsync(
            Arg.Is<Order>(order =>
                order.TableId == 1 &&
                order.Status == OrderStatus.Pending),
            Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Create_rejects_existing_open_order()
    {
        _tables.GetByIdAsync(1, Arg.Any<CancellationToken>())
            .Returns(new Table(1, 4) { Version = 1 });
        _orders.GetOpenByTableIdAsync(1, Arg.Any<CancellationToken>())
            .Returns(new Order());

        await Assert.ThrowsAsync<ConflictException>(() =>
            new CreateOrderCommandHandler(_orders, _tables).Handle(
                new CreateOrderCommand(1, 1), CancellationToken.None));
    }

    [Fact]
    public async Task Create_maps_database_race_to_table_conflict()
    {
        _tables.GetByIdAsync(1, Arg.Any<CancellationToken>())
            .Returns(new Table(1, 4) { Version = 1 });
        _orders.GetOpenByTableIdAsync(1, Arg.Any<CancellationToken>())
            .Returns((Order?)null);
        _orders.SaveChangesAsync(Arg.Any<CancellationToken>())
            .Returns(Task.FromException<int>(
                new ConflictException("Unique constraint.")));

        var exception = await Assert.ThrowsAsync<ConflictException>(() =>
            new CreateOrderCommandHandler(_orders, _tables).Handle(
                new CreateOrderCommand(1, 1), CancellationToken.None));

        Assert.Equal(
            "Table 1 already has an open order.",
            exception.Message);
    }

    [Fact]
    public async Task AddItem_adds_available_product()
    {
        var order = PendingOrder();
        _orders.GetByIdWithDetailsAsync(1, Arg.Any<CancellationToken>())
            .Returns(order);
        _products.GetByIdAsync(2, Arg.Any<CancellationToken>())
            .Returns(new Product { Id = 2, Name = "Coffee", Price = 900 });

        var result = await new AddOrderItemCommandHandler(_orders, _products)
            .Handle(
                new AddOrderItemCommand(1, 2, 3, "No sugar", 1),
                CancellationToken.None);

        var item = Assert.Single(result.Items);
        Assert.Equal(3, item.Quantity);
        Assert.Equal("No sugar", item.Notes);
        Assert.Equal(2700, result.Total);
    }

    [Fact]
    public async Task UpdateItem_changes_quantity()
    {
        var order = PendingOrder();
        order.AddItem(2, 1, 900);
        order.Items.Single().Version = 1;
        _orders.GetByIdWithDetailsAsync(1, Arg.Any<CancellationToken>())
            .Returns(order);

        var result = await new UpdateOrderItemCommandHandler(_orders).Handle(
            new UpdateOrderItemCommand(1, 0, 4, "Extra hot", 1, 1),
            CancellationToken.None);

        Assert.Equal(4, Assert.Single(result.Items).Quantity);
        Assert.Equal("Extra hot", Assert.Single(result.Items).Notes);
        Assert.Equal(3600, result.Total);
    }

    [Fact]
    public async Task RemoveItem_removes_item()
    {
        var order = PendingOrder();
        order.AddItem(2, 1, 900);
        order.Items.Single().Version = 1;
        _orders.GetByIdWithDetailsAsync(1, Arg.Any<CancellationToken>())
            .Returns(order);

        var result = await new RemoveOrderItemCommandHandler(_orders).Handle(
            new RemoveOrderItemCommand(1, 0, 1, 1),
            CancellationToken.None);

        Assert.Empty(result.Items);
        Assert.Equal(0, result.Total);
    }

    [Fact]
    public async Task StartPreparing_updates_status()
    {
        var order = PendingOrder();
        _orders.GetByIdWithDetailsAsync(1, Arg.Any<CancellationToken>())
            .Returns(order);

        var result = await new StartPreparingOrderCommandHandler(_orders)
            .Handle(
                new StartPreparingOrderCommand(1, 1),
                CancellationToken.None);

        Assert.Equal(OrderStatus.Preparing, result.Status);
    }

    [Fact]
    public async Task MarkReady_updates_status()
    {
        var order = PendingOrder();
        order.StartPreparing();
        _orders.GetByIdWithDetailsAsync(1, Arg.Any<CancellationToken>())
            .Returns(order);

        var result = await new MarkOrderReadyCommandHandler(_orders)
            .Handle(
                new MarkOrderReadyCommand(1, 1),
                CancellationToken.None);

        Assert.Equal(OrderStatus.Ready, result.Status);
    }

    [Fact]
    public async Task Deliver_closes_order_and_releases_table()
    {
        var table = new Table(1, 4) { Id = 1, Version = 1 };
        table.Occupy();
        var order = PendingOrder(table);
        order.StartPreparing();
        order.MarkReady();
        _orders.GetByIdWithDetailsAsync(1, Arg.Any<CancellationToken>())
            .Returns(order);
        _tables.GetByIdAsync(1, Arg.Any<CancellationToken>()).Returns(table);

        var result = await new DeliverOrderCommandHandler(_orders, _tables)
            .Handle(
                new DeliverOrderCommand(1, 1),
                CancellationToken.None);

        Assert.Equal(OrderStatus.Delivered, result.Status);
        Assert.Equal(TableStatus.Available, table.Status);
    }

    [Fact]
    public async Task Cancel_closes_order_and_releases_table()
    {
        var table = new Table(1, 4) { Id = 1, Version = 1 };
        table.Occupy();
        var order = PendingOrder(table);
        _orders.GetByIdWithDetailsAsync(1, Arg.Any<CancellationToken>())
            .Returns(order);
        _tables.GetByIdAsync(1, Arg.Any<CancellationToken>()).Returns(table);

        var result = await new CancelOrderCommandHandler(_orders, _tables)
            .Handle(
                new CancelOrderCommand(1, 1),
                CancellationToken.None);

        Assert.Equal(OrderStatus.Cancelled, result.Status);
        Assert.Equal(TableStatus.Available, table.Status);
    }

    [Fact]
    public async Task GetById_maps_order()
    {
        _orders.GetByIdWithDetailsAsNoTrackingAsync(
                1, Arg.Any<CancellationToken>())
            .Returns(PendingOrder());

        var result = await new GetOrderByIdQueryHandler(_orders).Handle(
            new GetOrderByIdQuery(1), CancellationToken.None);

        Assert.Equal(1, result.Id);
        Assert.Equal(1, result.TableNumber);
    }

    [Fact]
    public async Task GetPaged_clamps_parameters_and_maps_metadata()
    {
        _orders.GetPagedAsync(
                null, 1, 100, Arg.Any<CancellationToken>())
            .Returns(([PendingOrder()], 201));

        var result = await new GetOrdersQueryHandler(_orders).Handle(
            new GetOrdersQuery(null, 0, 500), CancellationToken.None);

        Assert.Equal(1, result.Page);
        Assert.Equal(100, result.PageSize);
        Assert.Equal(3, result.TotalPages);
        Assert.Single(result.Items);
    }

    [Fact]
    public async Task Missing_order_throws_not_found()
    {
        _orders.GetByIdWithDetailsAsync(99, Arg.Any<CancellationToken>())
            .Returns((Order?)null);

        await Assert.ThrowsAsync<NotFoundException>(() =>
            new StartPreparingOrderCommandHandler(_orders).Handle(
                new StartPreparingOrderCommand(99, 1),
                CancellationToken.None));
    }

    private static Order PendingOrder(Table? table = null)
    {
        table ??= new Table(1, 4) { Id = 1, Version = 1 };

        return new Order
        {
            Id = 1,
            TableId = table.Id,
            Table = table,
            Status = OrderStatus.Pending,
            Version = 1
        };
    }
}
