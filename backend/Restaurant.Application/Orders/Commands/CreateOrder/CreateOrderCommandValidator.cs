using FluentValidation;

namespace Restaurant.Application.Orders.Commands.CreateOrder;

public sealed class CreateOrderCommandValidator
    : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderCommandValidator()
    {
        RuleFor(x => x.TableId)
            .GreaterThan(0);
    }
}