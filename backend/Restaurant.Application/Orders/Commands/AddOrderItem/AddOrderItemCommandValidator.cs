using FluentValidation;

namespace Restaurant.Application.Orders.Commands.AddOrderItem;

public sealed class AddOrderItemCommandValidator
    : AbstractValidator<AddOrderItemCommand>
{
    public AddOrderItemCommandValidator()
    {
        RuleFor(x => x.OrderId).GreaterThan(0);
        RuleFor(x => x.ProductId).GreaterThan(0);
        RuleFor(x => x.Quantity).GreaterThan(0);
    }
}