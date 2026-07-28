using Restaurant.Domain.Entities.Common;

namespace Restaurant.Domain.Entities;

public sealed class IdempotencyRecord : Entity
{
    public string Operation { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
    public string RequestHash { get; set; } = string.Empty;
    public int OrderId { get; set; }
    public Order? Order { get; set; }
    public DateTime CreatedAt { get; set; }
}
