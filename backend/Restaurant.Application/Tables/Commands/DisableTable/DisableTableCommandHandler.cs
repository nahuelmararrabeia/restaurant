using MediatR;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Tables.Commands.DisableTable;

public sealed class DisableTableCommandHandler
    : IRequestHandler<DisableTableCommand>
{
    private readonly ITableRepository _tableRepository;

    public DisableTableCommandHandler(ITableRepository tableRepository)
    {
        _tableRepository = tableRepository;
    }

    public async Task Handle(
        DisableTableCommand request,
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

        table.Disable();

        await _tableRepository.SaveChangesAsync(cancellationToken);
    }
}
