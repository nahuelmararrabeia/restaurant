using MediatR;

namespace Restaurant.Application.Tables.Commands.CreateTable
{
    public sealed record CreateTableCommand(
        int Number,
        int Capacity)
        : IRequest<int>;
}

