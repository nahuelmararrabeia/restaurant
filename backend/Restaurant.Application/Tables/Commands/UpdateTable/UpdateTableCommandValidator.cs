using FluentValidation;

namespace Restaurant.Application.Tables.Commands.UpdateTable;

public sealed class UpdateTableCommandValidator
    : AbstractValidator<UpdateTableCommand>
{
    public UpdateTableCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);

        RuleFor(x => x.Number)
            .GreaterThan(0);

        RuleFor(x => x.Capacity)
            .GreaterThan(0)
            .LessThanOrEqualTo(20);
    }
}