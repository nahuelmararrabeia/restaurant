using MediatR;

namespace Restaurant.Application.Tables.Commands.DeleteTable
{
    public sealed record DeleteTableCommand(
        int Id,
        long Version)
        : IRequest;
}
