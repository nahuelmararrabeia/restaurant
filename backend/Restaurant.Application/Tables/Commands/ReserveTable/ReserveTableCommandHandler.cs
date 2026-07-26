using MediatR;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Tables.Commands.ReserveTable;

public sealed class ReserveTableCommandHandler
    : IRequestHandler<ReserveTableCommand>
{
    private readonly ITableRepository _tableRepository;

    public ReserveTableCommandHandler(ITableRepository tableRepository)
    {
        _tableRepository = tableRepository;
    }

    public async Task Handle(
        ReserveTableCommand request,
        CancellationToken cancellationToken)
    {
        var table = await _tableRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (table is null)
            throw new NotFoundException($"Table {request.Id} was not found.");

        table.Reserve();

        await _tableRepository.SaveChangesAsync(cancellationToken);
    }
}