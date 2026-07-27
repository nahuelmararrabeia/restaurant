using FluentValidation;

namespace Restaurant.Application.Orders.Commands.CancelOrder;

public sealed class CancelOrderCommandValidator
    : AbstractValidator<CancelOrderCommand>
{
    public CancelOrderCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);
    }
}