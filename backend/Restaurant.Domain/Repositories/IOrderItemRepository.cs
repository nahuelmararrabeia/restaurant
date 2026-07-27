using Restaurant.Domain.Entities;

namespace Restaurant.Domain.Repositories;

public interface IOrderItemRepository
{
    Task<List<OrderItem>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<List<OrderItem>> GetByOrderIdAsync(int orderId, CancellationToken cancellationToken = default);
    Task<OrderItem?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task AddAsync(OrderItem orderItem, CancellationToken cancellationToken = default);
    void Update(OrderItem orderItem);
    void Delete(OrderItem orderItem);

    Task<bool> ExistsAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> ExistsByProductIdAsync(int productId, CancellationToken cancellationToken = default);
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
