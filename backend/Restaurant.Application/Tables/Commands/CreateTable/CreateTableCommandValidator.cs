using FluentValidation;

namespace Restaurant.Application.Tables.Commands.CreateTable;

public sealed class CreateTableCommandValidator
    : AbstractValidator<CreateTableCommand>
{
    public CreateTableCommandValidator()
    {
        RuleFor(x => x.Number)
            .GreaterThan(0);

        RuleFor(x => x.Capacity)
            .GreaterThan(0)
            .LessThanOrEqualTo(20);
    }
}