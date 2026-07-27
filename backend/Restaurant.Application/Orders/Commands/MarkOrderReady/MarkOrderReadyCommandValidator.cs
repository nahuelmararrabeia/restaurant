using FluentValidation;

namespace Restaurant.Application.Orders.Commands.MarkOrderReady;

public sealed class MarkOrderReadyCommandValidator
    : AbstractValidator<MarkOrderReadyCommand>
{
    public MarkOrderReadyCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);
    }
}