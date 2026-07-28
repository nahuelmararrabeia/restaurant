using Restaurant.Domain.Enums;

namespace Restaurant.Application.Orders.Responses;

public sealed record OrderItemResponse(
    int Id,
    int ProductId,
    string ProductName,
    int Quantity,
    decimal UnitPrice,
    decimal SubTotal,
    string? Notes,
    long Version);
