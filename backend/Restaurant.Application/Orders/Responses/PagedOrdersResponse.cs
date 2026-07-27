namespace Restaurant.Application.Orders.Responses;

public sealed record PagedOrdersResponse(
    List<OrderResponse> Items,
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages);
