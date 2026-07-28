using MediatR;

namespace Restaurant.Application.Tables.Commands.DisableTable
{
    public sealed record DisableTableCommand(
        int Id,
        long Version)
        : IRequest;
}
