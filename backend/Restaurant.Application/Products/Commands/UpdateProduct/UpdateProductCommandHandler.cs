using MediatR;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Products.Commands.UpdateProduct;

public sealed class UpdateProductCommandHandler
    : IRequestHandler<UpdateProductCommand>
{
    private readonly IProductRepository _repository;

    public UpdateProductCommandHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(
        UpdateProductCommand request,
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

        product.Update(
            request.Name.Trim(),
            request.Description?.Trim(),
            request.Price);

        await _repository.SaveChangesAsync(cancellationToken);
    }
}
