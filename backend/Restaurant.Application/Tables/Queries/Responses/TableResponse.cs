using Restaurant.Domain.Enums;

namespace Restaurant.Application.Tables.Responses;

public sealed record TableResponse(
    int Id,
    int Number,
    int Capacity,
    TableStatus Status,
    int? ActiveOrderId);
