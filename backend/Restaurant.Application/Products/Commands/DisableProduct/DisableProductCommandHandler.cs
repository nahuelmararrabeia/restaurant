using MediatR;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Products.Commands.DisableProduct;

public sealed class DisableProductCommandHandler
    : IRequestHandler<DisableProductCommand>
{
    private readonly IProductRepository _repository;

    public DisableProductCommandHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(
        DisableProductCommand request,
        CancellationToken cancellationToken)
    {
        var product = await _repository.GetByIdAsync(
            request.ProductId,
            cancellationToken);

        if (product is null)
            throw new KeyNotFoundException("Product not found.");

        Restaurant.Application.Common.ConcurrencyGuard.EnsureVersion(
            product,
            request.Version);

        product.Disable();

        await _repository.SaveChangesAsync(cancellationToken);
    }
}
