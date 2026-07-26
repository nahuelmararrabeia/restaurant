using Microsoft.EntityFrameworkCore;
using Restaurant.Domain.Entities;
using Restaurant.Domain.Enums;
using Restaurant.Domain.Repositories;
using Restaurant.Infrastructure.Persistence;

namespace Restaurant.Infrastructure.Repositories;

public class TableRepository : ITableRepository
{
    private readonly AppDbContext _context;

    public TableRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Table>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Tables
            .AsNoTracking()
            .OrderBy(x => x.Number)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Table>> GetAvailableAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Tables
            .AsNoTracking()
            .Where(x => x.Status == TableStatus.Available)
            .OrderBy(x => x.Number)
            .ToListAsync(cancellationToken);
    }

    public async Task<Table?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Tables
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<Table?> GetByNumberAsync(int number, CancellationToken cancellationToken = default)
    {
        return await _context.Tables
            .FirstOrDefaultAsync(x => x.Number == number, cancellationToken);
    }

    public async Task AddAsync(Table table, CancellationToken cancellationToken = default)
    {
        await _context.Tables.AddAsync(table, cancellationToken);
    }

    public void Update(Table table)
    {
        _context.Tables.Update(table);
    }

    public void Delete(Table table)
    {
        _context.Tables.Remove(table);
    }

    public async Task<bool> ExistsAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Tables.AnyAsync(x => x.Id == id, cancellationToken);
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(cancellationToken);
    }
}