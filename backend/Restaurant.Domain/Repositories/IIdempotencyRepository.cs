using Restaurant.Domain.Entities;

namespace Restaurant.Domain.Repositories;

public interface IIdempotencyRepository
{
    Task<IdempotencyRecord?> GetAsync(
        string operation,
        string key,
        CancellationToken cancellationToken = default);

    Task<IdempotencyRecord?> GetAfterConflictAsync(
        string operation,
        string key,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        IdempotencyRecord record,
        CancellationToken cancellationToken = default);
}
