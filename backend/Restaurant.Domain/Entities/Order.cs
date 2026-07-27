using Restaurant.Domain.Entities.Common;
using Restaurant.Domain.Enums;
using Restaurant.Domain.Exceptions;

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

        public void AddItem(int productId, int quantity, decimal unitPrice)
        {
            if (Status is OrderStatus.Delivered or OrderStatus.Cancelled)
                throw new BusinessException("Cannot modify a closed order.");

            var existingItem = Items.FirstOrDefault(x => x.ProductId == productId);

            if (existingItem is null)
            {
                Items.Add(new OrderItem
                {
                    ProductId = productId,
                    Quantity = quantity,
                    UnitPrice = unitPrice
                });
            }
            else
            {
                existingItem.Quantity += quantity;
            }

            RecalculateTotal();
        }

        public void RemoveItem(int orderItemId)
        {
            if (Status is OrderStatus.Delivered or OrderStatus.Cancelled)
                throw new BusinessException("Cannot modify a closed order.");

            var item = Items.FirstOrDefault(x => x.Id == orderItemId);

            if (item is null)
                throw new BusinessException("Order item not found.");

            Items.Remove(item);
            RecalculateTotal();
        }

        public void StartPreparing()
        {
            if (Status != OrderStatus.Pending)
                throw new BusinessException("Only pending orders can be moved to preparing.");

            Status = OrderStatus.Preparing;
        }

        public void MarkReady()
        {
            if (Status != OrderStatus.Preparing)
                throw new BusinessException("Only preparing orders can be marked as ready.");

            Status = OrderStatus.Ready;
        }

        public void Deliver()
        {
            if (Status != OrderStatus.Ready)
                throw new BusinessException("Only ready orders can be delivered.");

            Status = OrderStatus.Delivered;
            ClosedAt = DateTime.UtcNow;
        }

        public void Cancel()
        {
            if (Status == OrderStatus.Delivered)
                throw new BusinessException("Delivered orders cannot be cancelled.");

            Status = OrderStatus.Cancelled;
            ClosedAt = DateTime.UtcNow;
        }

        private void RecalculateTotal()
        {
            Total = Items.Sum(x => x.Quantity * x.UnitPrice);
        }
    }
}
