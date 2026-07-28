using MediatR;

namespace Restaurant.Application.Tables.Commands.ReserveTable
{
    public sealed record ReserveTableCommand(
        int Id,
        long Version)
        : IRequest;
}
