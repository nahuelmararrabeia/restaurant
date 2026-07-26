using MediatR;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Tables.Commands.EnableTable;

public sealed class EnableTableCommandHandler
    : IRequestHandler<EnableTableCommand>
{
    private readonly ITableRepository _tableRepository;

    public EnableTableCommandHandler(ITableRepository tableRepository)
    {
        _tableRepository = tableRepository;
    }

    public async Task Handle(
        EnableTableCommand request,
        CancellationToken cancellationToken)
    {
        var table = await _tableRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (table is null)
            throw new NotFoundException($"Table {request.Id} was not found.");

        table.Enable();

        await _tableRepository.SaveChangesAsync(cancellationToken);
    }
}