using FluentValidation;

namespace Restaurant.Application.Tables.Commands.ReserveTable;

public sealed class ReserveTableCommandValidator
    : AbstractValidator<ReserveTableCommand>
{
    public ReserveTableCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);
    }
}