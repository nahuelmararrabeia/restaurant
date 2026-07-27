using Microsoft.EntityFrameworkCore;
using Restaurant.Domain.Entities;
using Restaurant.Domain.Repositories;
using Restaurant.Infrastructure.Persistence;

namespace Restaurant.Infrastructure.Repositories;

public class OrderItemRepository : IOrderItemRepository
{
    private readonly AppDbContext _context;

    public OrderItemRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<OrderItem>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.OrderItems
            .AsNoTracking()
            .Include(x => x.Product)
            .Include(x => x.Order)
            .OrderByDescending(x => x.Id)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<OrderItem>> GetByOrderIdAsync(int orderId, CancellationToken cancellationToken = default)
    {
        return await _context.OrderItems
            .AsNoTracking()
            .Include(x => x.Product)
            .Where(x => x.OrderId == orderId)
            .OrderBy(x => x.Id)
            .ToListAsync(cancellationToken);
    }

    public async Task<OrderItem?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.OrderItems
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task AddAsync(OrderItem orderItem, CancellationToken cancellationToken = default)
    {
        await _context.OrderItems.AddAsync(orderItem, cancellationToken);
    }

    public void Update(OrderItem orderItem)
    {
        _context.OrderItems.Update(orderItem);
    }

    public void Delete(OrderItem orderItem)
    {
        _context.OrderItems.Remove(orderItem);
    }

    public async Task<bool> ExistsAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.OrderItems.AnyAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<bool> ExistsByProductIdAsync(
        int productId,
        CancellationToken cancellationToken = default)
    {
        return await _context.OrderItems.AnyAsync(
            item => item.ProductId == productId,
            cancellationToken);
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(cancellationToken);
    }
}
