using MediatR;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Tables.Commands.ReleaseTable;

public sealed class ReleaseTableCommandHandler
    : IRequestHandler<ReleaseTableCommand>
{
    private readonly ITableRepository _tableRepository;

    public ReleaseTableCommandHandler(ITableRepository tableRepository)
    {
        _tableRepository = tableRepository;
    }

    public async Task Handle(
        ReleaseTableCommand request,
        CancellationToken cancellationToken)
    {
        var table = await _tableRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (table is null)
            throw new NotFoundException($"Table {request.Id} was not found.");

        table.Release();

        await _tableRepository.SaveChangesAsync(cancellationToken);
    }
}