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
    private readonly IIdempotencyRepository _idempotencyRepository;

    public AddOrderItemCommandHandler(
        IOrderRepository orderRepository,
        IProductRepository productRepository,
        IIdempotencyRepository idempotencyRepository)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
        _idempotencyRepository = idempotencyRepository;
    }

    public async Task<OrderDetailsResponse> Handle(
        AddOrderItemCommand request,
        CancellationToken cancellationToken)
    {
        var key = Restaurant.Application.Common.Idempotency
            .NormalizeKey(request.IdempotencyKey);
        var requestHash = Restaurant.Application.Common.Idempotency.Hash(
            request.OrderId,
            request.ProductId,
            request.Quantity,
            request.Notes?.Trim(),
            request.Version);
        var previous = await _idempotencyRepository.GetAsync(
            Restaurant.Application.Common.Idempotency.AddOrderItem,
            key,
            cancellationToken);

        if (previous is not null)
        {
            Restaurant.Application.Common.Idempotency.EnsureSameRequest(
                previous,
                requestHash);
            return await GetRecordedOrder(
                previous.OrderId,
                cancellationToken);
        }

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

        await _idempotencyRepository.AddAsync(
            new Restaurant.Domain.Entities.IdempotencyRecord
            {
                Operation = Restaurant.Application.Common.Idempotency
                    .AddOrderItem,
                Key = key,
                RequestHash = requestHash,
                OrderId = order.Id,
                Order = order,
                CreatedAt = DateTime.UtcNow
            },
            cancellationToken);

        try
        {
            await _orderRepository.SaveChangesAsync(cancellationToken);
        }
        catch (ConflictException)
        {
            var concurrent = await _idempotencyRepository
                .GetAfterConflictAsync(
                    Restaurant.Application.Common.Idempotency.AddOrderItem,
                    key,
                    cancellationToken);

            if (concurrent is null)
                throw;

            Restaurant.Application.Common.Idempotency.EnsureSameRequest(
                concurrent,
                requestHash);
            return await GetRecordedOrder(
                concurrent.OrderId,
                cancellationToken);
        }

        return order.ToDetailsResponse();
    }

    private async Task<OrderDetailsResponse> GetRecordedOrder(
        int orderId,
        CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetByIdWithDetailsAsync(
            orderId,
            cancellationToken);

        if (order is null)
            throw new NotFoundException(
                $"Order {orderId} was not found.");

        return order.ToDetailsResponse();
    }
}
