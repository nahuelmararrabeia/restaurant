using MediatR;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Products.Commands.DeleteProduct;

public sealed class DeleteProductCommandHandler
    : IRequestHandler<DeleteProductCommand>
{
    private readonly IProductRepository _repository;

    public DeleteProductCommandHandler(IProductRepository repository)
    {
        _repository = repository;
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

        _repository.Delete(product);

        await _repository.SaveChangesAsync(cancellationToken);
    }
}