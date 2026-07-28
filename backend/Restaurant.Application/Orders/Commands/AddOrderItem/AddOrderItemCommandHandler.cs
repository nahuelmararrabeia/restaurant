using MediatR;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Application.Orders.Mappings;
using Restaurant.Application.Orders.Responses;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Orders.Commands.AddOrderItem;

public sealed class AddOrderItemCommandHandler
    : IRequestHandler<AddOrderItemCommand, OrderDetailsResponse>
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

    public async Task<OrderDetailsResponse> Handle(
        AddOrderItemCommand request,
        CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetByIdWithDetailsAsync(
            request.OrderId,
            cancellationToken);

        if (order is null)
            throw new NotFoundException($"Order {request.OrderId} was not found.");

        Restaurant.Application.Common.ConcurrencyGuard.EnsureVersion(
            order,
            request.Version);

        var product = await _productRepository.GetByIdAsync(
            request.ProductId,
            cancellationToken);

        if (product is null)
            throw new NotFoundException($"Product {request.ProductId} was not found.");

        if (!product.IsAvailable)
            throw new BusinessException($"Product {request.ProductId} is not available.");

        order.AddItem(
            product.Id,
            request.Quantity,
            product.Price,
            request.Notes);

        await _orderRepository.SaveChangesAsync(cancellationToken);

        return order.ToDetailsResponse();
    }
}
