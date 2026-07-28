using MediatR;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Products.Commands.EnableProduct;

public sealed class EnableProductCommandHandler
    : IRequestHandler<EnableProductCommand>
{
    private readonly IProductRepository _repository;

    public EnableProductCommandHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(
        EnableProductCommand request,
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

        product.Enable();

        await _repository.SaveChangesAsync(cancellationToken);
    }
}
