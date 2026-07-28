using MediatR;
using Restaurant.Application.Products.Responses;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Products.Queries.GetProductById;

public sealed class GetProductByIdQueryHandler
    : IRequestHandler<GetProductByIdQuery, ProductResponse>
{
    private readonly IProductRepository _repository;

    public GetProductByIdQueryHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<ProductResponse> Handle(
        GetProductByIdQuery request,
        CancellationToken cancellationToken)
    {
        var product = await _repository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (product is null)
            throw new KeyNotFoundException("Product not found.");

        return new ProductResponse(
            product.Id,
            product.Name,
            product.Description,
            product.Price,
            product.IsAvailable,
            product.Version);
    }
}
