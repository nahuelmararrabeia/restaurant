using MediatR;
using Restaurant.Application.Tables.Responses;

namespace Restaurant.Application.Tables.Queries.GetTables;

public sealed record GetTablesQuery() : IRequest<List<TableResponse>>;