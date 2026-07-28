using MediatR;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Tables.Commands.UpdateTablePosition;

public sealed class UpdateTablePositionCommandHandler
    : IRequestHandler<UpdateTablePositionCommand>
{
    private readonly ITableRepository _tableRepository;

    public UpdateTablePositionCommandHandler(
        ITableRepository tableRepository)
    {
        _tableRepository = tableRepository;
    }

    public async Task Handle(
        UpdateTablePositionCommand request,
        CancellationToken cancellationToken)
    {
        var table = await _tableRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (table is null)
            throw new NotFoundException(
                $"Table {request.Id} was not found.");

        table.SetPosition(request.PositionX, request.PositionY);

        await _tableRepository.SaveChangesAsync(cancellationToken);
    }
}
