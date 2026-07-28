using Restaurant.Application.Orders.Responses;
using Restaurant.Domain.Entities;

namespace Restaurant.Application.Orders.Mappings;

public static class OrderDetailsMappings
{

    public static OrderDetailsResponse ToDetailsResponse(this Order order)
    {
        return new OrderDetailsResponse(
            order.Id,
            order.TableId,
            order.Table?.Number ?? 0,
            order.Status,
            order.OrderedAt,
            order.ClosedAt,
            order.Total,
            order.Items
                .Select(item => item.ToResponse())
                .ToList(),
            order.Version
        );
    }
}
