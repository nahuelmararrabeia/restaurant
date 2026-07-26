using FluentValidation;

namespace Restaurant.Application.Tables.Commands.OccupyTable;

public sealed class OccupyTableCommandValidator
    : AbstractValidator<OccupyTableCommand>
{
    public OccupyTableCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);
    }
}