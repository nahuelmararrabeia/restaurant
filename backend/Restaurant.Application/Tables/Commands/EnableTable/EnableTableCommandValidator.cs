using FluentValidation;

namespace Restaurant.Application.Tables.Commands.EnableTable;

public sealed class EnableTableCommandValidator
    : AbstractValidator<EnableTableCommand>
{
    public EnableTableCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);
    }
}