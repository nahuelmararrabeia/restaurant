using Microsoft.EntityFrameworkCore;
using Restaurant.Domain.Entities;
using Restaurant.Domain.Repositories;
using Restaurant.Infrastructure.Persistence;

namespace Restaurant.Infrastructure.Repositories;

public sealed class IdempotencyRepository : IIdempotencyRepository
{
    private readonly AppDbContext _context;

    public IdempotencyRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task<IdempotencyRecord?> GetAsync(
        string operation,
        string key,
        CancellationToken cancellationToken = default)
    {
        return Query(operation, key)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public Task<IdempotencyRecord?> GetAfterConflictAsync(
        string operation,
        string key,
        CancellationToken cancellationToken = default)
    {
        _context.ChangeTracker.Clear();
        return Query(operation, key)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task AddAsync(
        IdempotencyRecord record,
        CancellationToken cancellationToken = default)
    {
        await _context.IdempotencyRecords.AddAsync(
            record,
            cancellationToken);
    }

    private IQueryable<IdempotencyRecord> Query(
        string operation,
        string key)
    {
        return _context.IdempotencyRecords
            .AsNoTracking()
            .Where(record =>
                record.Operation == operation &&
                record.Key == key);
    }
}
