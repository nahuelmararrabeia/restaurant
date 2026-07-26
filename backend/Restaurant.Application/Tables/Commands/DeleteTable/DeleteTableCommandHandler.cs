using MediatR;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Domain.Enums;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Tables.Commands.DeleteTable;

public sealed class DeleteTableCommandHandler
    : IRequestHandler<DeleteTableCommand>
{
    private readonly ITableRepository _tableRepository;

    public DeleteTableCommandHandler(ITableRepository tableRepository)
    {
        _tableRepository = tableRepository;
    }

    public async Task Handle(
        DeleteTableCommand request,
        CancellationToken cancellationToken)
    {
        var table = await _tableRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (table is null)
            throw new NotFoundException($"Table {request.Id} was not found.");

        if (table.Status is TableStatus.Occupied or TableStatus.Reserved)
            throw new BusinessException(
                "You cannot delete an occupied or reserved table.");

        _tableRepository.Delete(table);
        await _tableRepository.SaveChangesAsync(cancellationToken);
    }
}