using MediatR;
using Restaurant.Application.Tables.Responses;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Tables.Queries.GetTables;

public sealed class GetTablesQueryHandler
    : IRequestHandler<GetTablesQuery, List<TableResponse>>
{
    private readonly ITableRepository _tableRepository;

    public GetTablesQueryHandler(ITableRepository tableRepository)
    {
        _tableRepository = tableRepository;
    }

    public async Task<List<TableResponse>> Handle(
        GetTablesQuery request,
        CancellationToken cancellationToken)
    {
        var tables = await _tableRepository.GetAllAsync(cancellationToken);

        var items = tables
            .Select(x => new TableResponse(
                x.Id,
                x.Number,
                x.Capacity,
                x.Status))
            .ToList();

        return items;
    }
}