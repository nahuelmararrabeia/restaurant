using Restaurant.Domain.Entities;

namespace Restaurant.Domain.Repositories;

public interface ITableRepository
{
    Task<List<Table>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<List<Table>> GetAvailableAsync(CancellationToken cancellationToken = default);
    Task<Table?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> ExistsByNumberAsync(int number, CancellationToken cancellationToken = default);

    Task AddAsync(Table table, CancellationToken cancellationToken = default);
    void Update(Table table);
    void Delete(Table table);

    Task<bool> ExistsAsync(int id, CancellationToken cancellationToken = default);
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}