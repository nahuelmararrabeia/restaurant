using FluentValidation;

namespace Restaurant.Application.Orders.Commands.DeliverOrder;

public sealed class DeliverOrderCommandValidator
    : AbstractValidator<DeliverOrderCommand>
{
    public DeliverOrderCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);
    }
}