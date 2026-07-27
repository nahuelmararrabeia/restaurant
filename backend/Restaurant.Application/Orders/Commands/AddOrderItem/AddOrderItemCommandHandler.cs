using MediatR;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Orders.Commands.AddOrderItem;

public sealed class AddOrderItemCommandHandler
    : IRequestHandler<AddOrderItemCommand>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;

    public AddOrderItemCommandHandler(
        IOrderRepository orderRepository,
        IProductRepository productRepository)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
    }

    public async Task Handle(
        AddOrderItemCommand request,
        CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetByIdWithDetailsAsync(
            request.OrderId,
            cancellationToken);

        if (order is null)
            throw new NotFoundException($"Order {request.OrderId} was not found.");

        var product = await _productRepository.GetByIdAsync(
            request.ProductId,
            cancellationToken);

        if (product is null)
            throw new NotFoundException($"Product {request.ProductId} was not found.");

        if (!product.IsAvailable)
            throw new BusinessException($"Product {request.ProductId} is not available.");

        order.AddItem(product.Id, request.Quantity, product.Price);

        await _orderRepository.SaveChangesAsync(cancellationToken);
    }
}