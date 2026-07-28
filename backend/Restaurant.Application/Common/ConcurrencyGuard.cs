using Restaurant.Application.Common.Exceptions;
using Restaurant.Domain.Entities.Common;

namespace Restaurant.Application.Common;

public static class ConcurrencyGuard
{
    public static void EnsureVersion(
        AuditableEntity entity,
        long expectedVersion)
    {
        if (expectedVersion <= 0 || entity.Version != expectedVersion)
        {
            throw new ConflictException(
                "The resource was modified by another operation. Reload it and try again.");
        }
    }
}
