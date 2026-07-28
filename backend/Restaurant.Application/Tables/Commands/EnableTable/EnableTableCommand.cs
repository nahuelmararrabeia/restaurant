using MediatR;

namespace Restaurant.Application.Tables.Commands.EnableTable
{
    public sealed record EnableTableCommand(
        int Id,
        long Version)
        : IRequest;
}
