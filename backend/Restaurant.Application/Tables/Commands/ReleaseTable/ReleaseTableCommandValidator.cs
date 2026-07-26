using FluentValidation;

namespace Restaurant.Application.Tables.Commands.ReleaseTable;

public sealed class ReleaseTableCommandValidator
    : AbstractValidator<ReleaseTableCommand>
{
    public ReleaseTableCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);
    }
}