using Restaurant.Domain.Entities.Common;
using Restaurant.Domain.Enums;

namespace Restaurant.Domain.Entities
{
    public class Order : AuditableEntity
    {
        public int TableId { get; set; }
        public Table? Table { get; set; }

        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        public DateTime OrderedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ClosedAt { get; set; }

        public decimal Total { get; set; }

        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}
