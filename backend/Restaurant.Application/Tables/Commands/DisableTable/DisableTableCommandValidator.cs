using FluentValidation;

namespace Restaurant.Application.Tables.Commands.DisableTable;

public sealed class DisableTableCommandValidator
    : AbstractValidator<DisableTableCommand>
{
    public DisableTableCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);
    }
}