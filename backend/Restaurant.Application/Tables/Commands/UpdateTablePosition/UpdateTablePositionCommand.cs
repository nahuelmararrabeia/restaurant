using MediatR;

namespace Restaurant.Application.Tables.Commands.UpdateTablePosition;

public sealed record UpdateTablePositionCommand(
    int Id,
    double PositionX,
    double PositionY,
    long Version) : IRequest;
