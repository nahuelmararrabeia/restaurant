using MediatR;
using Restaurant.Application.Tables.Responses;

namespace Restaurant.Application.Tables.Queries.GetTableById;

public sealed record GetTableByIdQuery(int Id) : IRequest<TableResponse>;