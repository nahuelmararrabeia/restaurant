using Restaurant.Application.Orders.Responses;
using Restaurant.Domain.Entities;

namespace Restaurant.Application.Orders.Mappings;

public static class OrderMappings
{
    public static OrderResponse ToResponse(this Order order)
    {
        return new OrderResponse(
            order.Id,
            order.TableId,
            order.Table?.Number ?? 0,
            order.Status,
            order.OrderedAt,
            order.ClosedAt,
            order.Items
                .Select(item => item.ToResponse())
                .ToList(),
            order.Total,
            order.Version
        );
    }
}
