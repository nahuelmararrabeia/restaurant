using FluentValidation;

namespace Restaurant.Application.Tables.Commands.DeleteTable;

public sealed class DeleteTableCommandValidator
    : AbstractValidator<DeleteTableCommand>
{
    public DeleteTableCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);
    }
}