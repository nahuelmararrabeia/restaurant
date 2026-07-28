using MediatR;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Products.Commands.DeleteProduct;

public sealed class DeleteProductCommandHandler
    : IRequestHandler<DeleteProductCommand>
{
    private readonly IProductRepository _repository;
    private readonly IOrderItemRepository _orderItemRepository;

    public DeleteProductCommandHandler(
        IProductRepository repository,
        IOrderItemRepository orderItemRepository)
    {
        _repository = repository;
        _orderItemRepository = orderItemRepository;
    }

    public async Task Handle(
        DeleteProductCommand request,
        CancellationToken cancellationToken)
    {
        var product = await _repository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (product is null)
            throw new KeyNotFoundException("Product not found.");

        Restaurant.Application.Common.ConcurrencyGuard.EnsureVersion(
            product,
            request.Version);

        var isUsedInOrders = await _orderItemRepository
            .ExistsByProductIdAsync(request.Id, cancellationToken);

        if (isUsedInOrders)
            throw new ConflictException(
                "Products used in existing orders cannot be deleted.");

        _repository.Delete(product);

        await _repository.SaveChangesAsync(cancellationToken);
    }
}
