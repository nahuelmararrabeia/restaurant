using FluentValidation;

namespace Restaurant.Application.Orders.Commands.StartPreparingOrder;

public sealed class StartPreparingOrderCommandValidator
    : AbstractValidator<StartPreparingOrderCommand>
{
    public StartPreparingOrderCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);
    }
}