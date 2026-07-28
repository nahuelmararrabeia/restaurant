using FluentValidation;

namespace Restaurant.Application.Tables.Commands.UpdateTablePosition;

public sealed class UpdateTablePositionCommandValidator
    : AbstractValidator<UpdateTablePositionCommand>
{
    public UpdateTablePositionCommandValidator()
    {
        RuleFor(command => command.Id).GreaterThan(0);
        RuleFor(command => command.PositionX).InclusiveBetween(0, 100);
        RuleFor(command => command.PositionY).InclusiveBetween(0, 100);
    }
}
