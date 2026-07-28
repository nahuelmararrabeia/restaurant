using Restaurant.Domain.Entities;
using Restaurant.Domain.Enums;
using Restaurant.Domain.Exceptions;

namespace Restaurant.Domain.Tests.Entities;

public sealed class TableTests
{
    [Fact]
    public void Constructor_creates_available_table()
    {
        var table = new Table(7, 6);

        Assert.Equal(7, table.Number);
        Assert.Equal(6, table.Capacity);
        Assert.Equal(TableStatus.Available, table.Status);
        Assert.Empty(table.Orders);
    }

    [Fact]
    public void Update_replaces_number_and_capacity()
    {
        var table = new Table(1, 2);

        table.Update(3, 8);

        Assert.Equal(3, table.Number);
        Assert.Equal(8, table.Capacity);
    }

    [Fact]
    public void SetPosition_stores_normalized_coordinates()
    {
        var table = new Table(1, 4);

        table.SetPosition(25.5, 70.25);

        Assert.Equal(25.5, table.PositionX);
        Assert.Equal(70.25, table.PositionY);
    }

    [Theory]
    [InlineData(-1, 50)]
    [InlineData(101, 50)]
    [InlineData(50, -1)]
    [InlineData(50, 101)]
    public void SetPosition_rejects_coordinates_outside_floor(
        double positionX,
        double positionY)
    {
        var table = new Table(1, 4);

        Assert.Throws<BusinessException>(
            () => table.SetPosition(positionX, positionY));
    }

    [Fact]
    public void Disable_and_enable_change_availability()
    {
        var table = new Table(1, 4);

        table.Disable();
        Assert.Equal(TableStatus.Disabled, table.Status);

        table.Enable();
        Assert.Equal(TableStatus.Available, table.Status);
    }

    [Fact]
    public void Enable_does_nothing_when_table_is_not_disabled()
    {
        var table = new Table(1, 4);
        table.Reserve();

        table.Enable();

        Assert.Equal(TableStatus.Reserved, table.Status);
    }

    [Fact]
    public void Occupy_accepts_available_table()
    {
        var table = new Table(1, 4);

        table.Occupy();

        Assert.Equal(TableStatus.Occupied, table.Status);
    }

    [Fact]
    public void Occupy_accepts_reserved_table()
    {
        var table = new Table(1, 4);
        table.Reserve();

        table.Occupy();

        Assert.Equal(TableStatus.Occupied, table.Status);
    }

    [Fact]
    public void Occupy_rejects_disabled_table()
    {
        var table = new Table(1, 4);
        table.Disable();

        Assert.Throws<BusinessException>(table.Occupy);
    }

    [Fact]
    public void Disable_rejects_occupied_table()
    {
        var table = new Table(1, 4);
        table.Occupy();

        Assert.Throws<BusinessException>(table.Disable);
    }

    [Fact]
    public void Release_makes_occupied_table_available()
    {
        var table = new Table(1, 4);
        table.Occupy();

        table.Release();

        Assert.Equal(TableStatus.Available, table.Status);
    }

    [Fact]
    public void Release_rejects_non_occupied_table()
    {
        var table = new Table(1, 4);

        Assert.Throws<BusinessException>(table.Release);
    }

    [Fact]
    public void Reserve_and_cancel_reservation_restore_availability()
    {
        var table = new Table(1, 4);

        table.Reserve();
        Assert.Equal(TableStatus.Reserved, table.Status);

        table.CancelReservation();
        Assert.Equal(TableStatus.Available, table.Status);
    }

    [Fact]
    public void Reserve_rejects_non_available_table()
    {
        var table = new Table(1, 4);
        table.Disable();

        Assert.Throws<BusinessException>(table.Reserve);
    }

    [Fact]
    public void CancelReservation_rejects_non_reserved_table()
    {
        var table = new Table(1, 4);

        Assert.Throws<BusinessException>(table.CancelReservation);
    }
}
