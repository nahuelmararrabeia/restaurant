using Restaurant.Application.Orders.Responses;
using Restaurant.Domain.Entities;

namespace Restaurant.Application.Orders.Mappings;

public static class OrderItemMappings
{
    public static OrderItemResponse ToResponse(this OrderItem item)
    {
        return new OrderItemResponse(
            item.Id,
            item.ProductId,
            item.Product?.Name ?? string.Empty,
            item.Quantity,
            item.UnitPrice,
            item.Quantity * item.UnitPrice
        );
    }
}