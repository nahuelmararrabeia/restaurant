using MediatR;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Tables.Commands.UpdateTable;

public sealed class UpdateTableCommandHandler
    : IRequestHandler<UpdateTableCommand>
{
    private readonly ITableRepository _tableRepository;

    public UpdateTableCommandHandler(ITableRepository tableRepository)
    {
        _tableRepository = tableRepository;
    }

    public async Task Handle(
        UpdateTableCommand request,
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

        if (table.Number != request.Number)
        {
            var exists = await _tableRepository.ExistsByNumberAsync(
                request.Number,
                cancellationToken);

            if (exists)
                throw new ConflictException(
                    $"Table '{request.Number}' already exists.");
        }

        table.Update(request.Number, request.Capacity);

        await _tableRepository.SaveChangesAsync(cancellationToken);
    }
}
