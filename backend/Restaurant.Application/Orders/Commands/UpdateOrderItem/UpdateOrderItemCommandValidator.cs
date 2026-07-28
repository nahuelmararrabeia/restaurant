using FluentValidation;

namespace Restaurant.Application.Orders.Commands.UpdateOrderItem;

public sealed class UpdateOrderItemCommandValidator
    : AbstractValidator<UpdateOrderItemCommand>
{
    public UpdateOrderItemCommandValidator()
    {
        RuleFor(x => x.OrderId).GreaterThan(0);
        RuleFor(x => x.ItemId).GreaterThan(0);
        RuleFor(x => x.Quantity).GreaterThan(0);
        RuleFor(x => x.Notes).MaximumLength(250);
    }
}
