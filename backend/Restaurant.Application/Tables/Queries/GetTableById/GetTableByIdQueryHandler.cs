using MediatR;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Application.Tables.Responses;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Tables.Queries.GetTableById;

public sealed class GetTableByIdQueryHandler
    : IRequestHandler<GetTableByIdQuery, TableResponse>
{
    private readonly ITableRepository _tableRepository;

    public GetTableByIdQueryHandler(ITableRepository tableRepository)
    {
        _tableRepository = tableRepository;
    }

    public async Task<TableResponse> Handle(
        GetTableByIdQuery request,
        CancellationToken cancellationToken)
    {
        var table = await _tableRepository.GetByIdWithActiveOrderAsync(
            request.Id,
            cancellationToken);

        if (table is null)
            throw new NotFoundException($"Table {request.Id} was not found.");

        return new TableResponse(
            table.Id,
            table.Number,
            table.Capacity,
            table.Status,
            table.Orders.FirstOrDefault()?.Id,
            table.PositionX,
            table.PositionY,
            table.Version);
    }
}
