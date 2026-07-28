using MediatR;

namespace Restaurant.Application.Tables.Commands.UpdateTable;

public sealed record UpdateTableCommand(
    int Id,
    int Number,
    int Capacity,
    long Version)
    : IRequest;
