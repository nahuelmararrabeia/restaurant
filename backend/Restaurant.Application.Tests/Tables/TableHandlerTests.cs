using NSubstitute;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Application.Tables.Commands.CreateTable;
using Restaurant.Application.Tables.Commands.DeleteTable;
using Restaurant.Application.Tables.Commands.DisableTable;
using Restaurant.Application.Tables.Commands.EnableTable;
using Restaurant.Application.Tables.Commands.OccupyTable;
using Restaurant.Application.Tables.Commands.ReleaseTable;
using Restaurant.Application.Tables.Commands.ReserveTable;
using Restaurant.Application.Tables.Commands.UpdateTable;
using Restaurant.Application.Tables.Commands.UpdateTablePosition;
using Restaurant.Application.Tables.Queries.GetTableById;
using Restaurant.Application.Tables.Queries.GetTables;
using Restaurant.Domain.Entities;
using Restaurant.Domain.Enums;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Tests.Tables;

public sealed class TableHandlerTests
{
    private readonly ITableRepository _tables =
        Substitute.For<ITableRepository>();

    [Fact]
    public async Task Create_persists_unique_table()
    {
        _tables.ExistsByNumberAsync(1, Arg.Any<CancellationToken>())
            .Returns(false);

        await new CreateTableCommandHandler(_tables).Handle(
            new CreateTableCommand(1, 4),
            CancellationToken.None);

        await _tables.Received(1).AddAsync(
            Arg.Is<Table>(table => table.Number == 1 && table.Capacity == 4),
            Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Create_rejects_duplicate_number()
    {
        _tables.ExistsByNumberAsync(1, Arg.Any<CancellationToken>())
            .Returns(true);

        await Assert.ThrowsAsync<ConflictException>(() =>
            new CreateTableCommandHandler(_tables).Handle(
                new CreateTableCommand(1, 4),
                CancellationToken.None));
    }

    [Fact]
    public async Task Update_changes_table()
    {
        var table = new Table(1, 2);
        _tables.GetByIdAsync(1, Arg.Any<CancellationToken>()).Returns(table);
        _tables.ExistsByNumberAsync(2, Arg.Any<CancellationToken>())
            .Returns(false);

        await new UpdateTableCommandHandler(_tables).Handle(
            new UpdateTableCommand(1, 2, 6),
            CancellationToken.None);

        Assert.Equal(2, table.Number);
        Assert.Equal(6, table.Capacity);
    }

    [Fact]
    public async Task UpdatePosition_changes_and_persists_position()
    {
        var table = new Table(1, 4);
        _tables.GetByIdAsync(1, Arg.Any<CancellationToken>()).Returns(table);

        await new UpdateTablePositionCommandHandler(_tables).Handle(
            new UpdateTablePositionCommand(1, 25, 75),
            CancellationToken.None);

        Assert.Equal(25, table.PositionX);
        Assert.Equal(75, table.PositionY);
        await _tables.Received(1).SaveChangesAsync(
            Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Delete_removes_available_table()
    {
        var table = new Table(1, 4);
        _tables.GetByIdAsync(1, Arg.Any<CancellationToken>()).Returns(table);

        await new DeleteTableCommandHandler(_tables).Handle(
            new DeleteTableCommand(1),
            CancellationToken.None);

        _tables.Received(1).Delete(table);
    }

    [Fact]
    public async Task Delete_rejects_occupied_table()
    {
        var table = new Table(1, 4);
        table.Occupy();
        _tables.GetByIdAsync(1, Arg.Any<CancellationToken>()).Returns(table);

        await Assert.ThrowsAsync<BusinessException>(() =>
            new DeleteTableCommandHandler(_tables).Handle(
                new DeleteTableCommand(1),
                CancellationToken.None));
    }

    [Fact]
    public async Task Enable_enables_table()
    {
        var table = new Table(1, 4);
        table.Disable();
        _tables.GetByIdAsync(1, Arg.Any<CancellationToken>()).Returns(table);
        await new EnableTableCommandHandler(_tables).Handle(
            new EnableTableCommand(1), CancellationToken.None);
        Assert.Equal(TableStatus.Available, table.Status);
    }

    [Fact]
    public async Task Disable_disables_table()
    {
        var table = new Table(1, 4);
        _tables.GetByIdAsync(1, Arg.Any<CancellationToken>()).Returns(table);
        await new DisableTableCommandHandler(_tables).Handle(
            new DisableTableCommand(1), CancellationToken.None);
        Assert.Equal(TableStatus.Disabled, table.Status);
    }

    [Fact]
    public async Task Reserve_reserves_table()
    {
        var table = new Table(1, 4);
        _tables.GetByIdAsync(1, Arg.Any<CancellationToken>()).Returns(table);
        await new ReserveTableCommandHandler(_tables).Handle(
            new ReserveTableCommand(1), CancellationToken.None);
        Assert.Equal(TableStatus.Reserved, table.Status);
    }

    [Fact]
    public async Task Occupy_occupies_table()
    {
        var table = new Table(1, 4);
        _tables.GetByIdAsync(1, Arg.Any<CancellationToken>()).Returns(table);
        await new OccupyTableCommandHandler(_tables).Handle(
            new OccupyTableCommand(1), CancellationToken.None);
        Assert.Equal(TableStatus.Occupied, table.Status);
    }

    [Fact]
    public async Task Release_releases_table()
    {
        var table = new Table(1, 4);
        table.Occupy();
        _tables.GetByIdAsync(1, Arg.Any<CancellationToken>()).Returns(table);
        await new ReleaseTableCommandHandler(_tables).Handle(
            new ReleaseTableCommand(1), CancellationToken.None);
        Assert.Equal(TableStatus.Available, table.Status);
    }

    [Fact]
    public async Task GetById_maps_table_and_active_order()
    {
        var table = new Table(1, 4) { Id = 1 };
        table.Orders.Add(new Order { Id = 7 });
        _tables.GetByIdWithActiveOrderAsync(1, Arg.Any<CancellationToken>())
            .Returns(table);

        var result = await new GetTableByIdQueryHandler(_tables).Handle(
            new GetTableByIdQuery(1), CancellationToken.None);

        Assert.Equal(7, result.ActiveOrderId);
    }

    [Fact]
    public async Task GetAll_maps_tables()
    {
        _tables.GetAllAsync(Arg.Any<CancellationToken>())
            .Returns([new Table(1, 4) { Id = 1 }]);

        var result = await new GetTablesQueryHandler(_tables).Handle(
            new GetTablesQuery(), CancellationToken.None);

        Assert.Single(result);
        Assert.Equal(1, result[0].Number);
    }

    [Fact]
    public async Task Missing_table_throws_not_found()
    {
        _tables.GetByIdAsync(99, Arg.Any<CancellationToken>())
            .Returns((Table?)null);

        await Assert.ThrowsAsync<NotFoundException>(() =>
            new DisableTableCommandHandler(_tables).Handle(
                new DisableTableCommand(99), CancellationToken.None));
    }
}
