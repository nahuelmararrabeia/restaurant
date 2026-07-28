using MediatR;

namespace Restaurant.Application.Tables.Commands.OccupyTable
{
    public sealed record OccupyTableCommand(
        int Id,
        long Version)
        : IRequest;
}
