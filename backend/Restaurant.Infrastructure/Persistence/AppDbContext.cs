using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Domain.Entities;
using Restaurant.Domain.Entities.Common;

namespace Restaurant.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Table> Tables => Set<Table>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<IdempotencyRecord> IdempotencyRecords =>
        Set<IdempotencyRecord>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(AppDbContext).Assembly);
    }

    public override async Task<int> SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        ApplyAuditInfo();

        try
        {
            return await base.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateConcurrencyException)
        {
            throw new ConflictException(
                "The resource was modified by another operation. Reload it and try again.");
        }
        catch (DbUpdateException exception)
            when (IsConstraintViolation(exception))
        {
            throw new ConflictException(
                "The operation conflicts with existing data.");
        }
    }

    public override int SaveChanges()
    {
        ApplyAuditInfo();

        try
        {
            return base.SaveChanges();
        }
        catch (DbUpdateConcurrencyException)
        {
            throw new ConflictException(
                "The resource was modified by another operation. Reload it and try again.");
        }
        catch (DbUpdateException exception)
            when (IsConstraintViolation(exception))
        {
            throw new ConflictException(
                "The operation conflicts with existing data.");
        }
    }

    private static bool IsConstraintViolation(
        DbUpdateException exception)
    {
        return exception.InnerException is SqliteException
        {
            SqliteErrorCode: 19
        };
    }

    private void ApplyAuditInfo()
    {
        var entries = ChangeTracker
            .Entries<AuditableEntity>()
            .Where(e => e.State is EntityState.Added or EntityState.Modified);

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.Version = 1;
                entry.Entity.CreatedAt = DateTime.UtcNow;
                entry.Entity.CreatedBy ??= "system";
            }

            if (entry.State == EntityState.Modified)
            {
                entry.Entity.Version++;
                entry.Entity.UpdatedAt = DateTime.UtcNow;
                entry.Entity.UpdatedBy ??= "system";
            }
        }
    }
}
