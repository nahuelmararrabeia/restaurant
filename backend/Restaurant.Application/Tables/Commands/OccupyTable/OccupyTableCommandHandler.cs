using MediatR;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Tables.Commands.OccupyTable;

public sealed class OccupyTableCommandHandler
    : IRequestHandler<OccupyTableCommand>
{
    private readonly ITableRepository _tableRepository;

    public OccupyTableCommandHandler(ITableRepository tableRepository)
    {
        _tableRepository = tableRepository;
    }

    public async Task Handle(
        OccupyTableCommand request,
        CancellationToken cancellationToken)
    {
        var table = await _tableRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (table is null)
            throw new NotFoundException($"Table {request.Id} was not found.");

        Restaurant.Application.Common.ConcurrencyGuard.EnsureVersion(
            table,
            request.Version);

        table.Occupy();

        await _tableRepository.SaveChangesAsync(cancellationToken);
    }
}
