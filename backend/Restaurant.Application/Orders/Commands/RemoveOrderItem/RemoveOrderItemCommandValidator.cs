using FluentValidation;

namespace Restaurant.Application.Orders.Commands.RemoveOrderItem;

public sealed class RemoveOrderItemCommandValidator
    : AbstractValidator<RemoveOrderItemCommand>
{
    public RemoveOrderItemCommandValidator()
    {
        RuleFor(x => x.OrderId).GreaterThan(0);
        RuleFor(x => x.OrderItemId).GreaterThan(0);
    }
}