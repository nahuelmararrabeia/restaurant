using MediatR;

namespace Restaurant.Application.Tables.Commands.ReleaseTable
{
    public sealed record ReleaseTableCommand(
        int Id)
        : IRequest;
}
