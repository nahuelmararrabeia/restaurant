using MediatR;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Domain.Entities;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Tables.Commands.CreateTable;

public sealed class CreateTableCommandHandler
    : IRequestHandler<CreateTableCommand, int>
{
    private readonly ITableRepository _tableRepository;

    public CreateTableCommandHandler(ITableRepository tableRepository)
    {
        _tableRepository = tableRepository;
    }

    public async Task<int> Handle(
        CreateTableCommand request,
        CancellationToken cancellationToken)
    {
        var exists = await _tableRepository.ExistsByNumberAsync(
            request.Number,
            cancellationToken);

        if (exists)
            throw new ConflictException(
                $"Table '{request.Number}' already exists.");

        var table = new Table(request.Number, request.Capacity);

        await _tableRepository.AddAsync(table, cancellationToken);
        await _tableRepository.SaveChangesAsync(cancellationToken);

        return table.Id;
    }
}