using MediatR;
using Restaurant.Application.Products.Responses;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Products.Queries.GetProducts;

public sealed class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, List<ProductResponse>>
{
    private readonly IProductRepository _productRepository;

    public GetProductsQueryHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<List<ProductResponse>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var products = await _productRepository.GetAllAsync(cancellationToken);

        return products
            .Select(x => new ProductResponse
            (
                x.Id,
                x.Name,
                x.Description,
                x.Price,
                x.IsAvailable
            ))
            .ToList();
    }
}